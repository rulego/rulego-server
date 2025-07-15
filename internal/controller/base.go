package controller

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/rulego/rulego-server/config"
	"github.com/rulego/rulego-server/internal/constants"
	"github.com/rulego/rulego-server/internal/model"
	"github.com/rulego/rulego-server/internal/service"
	"github.com/rulego/rulego/endpoint/rest"

	"github.com/golang-jwt/jwt"
	"github.com/rulego/rulego/api/types"
	endpointApi "github.com/rulego/rulego/api/types/endpoint"
	"github.com/rulego/rulego/endpoint"
	"github.com/rulego/rulego/engine"
	"github.com/rulego/rulego/utils/json"
)

var ErrIllegalToken = errors.New("illegal token")

var Base = &base{}

type base struct {
}

type RuleGoClaim struct {
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.StandardClaims
}

// userNotFound 用户不存在
func userNotFound(username string, exchange *endpointApi.Exchange) bool {
	exchange.Out.SetStatusCode(http.StatusBadRequest)
	exchange.Out.SetBody([]byte("no found username for:" + username))
	return false
}

// unauthorized 用户未授权
func unauthorized(username string, exchange *endpointApi.Exchange) bool {
	exchange.Out.SetStatusCode(http.StatusUnauthorized)
	exchange.Out.SetBody([]byte("unauthorized for:" + username))
	return false
}

// GetRuleGoFunc 动态获取指定用户规则链池
func GetRuleGoFunc(exchange *endpointApi.Exchange) types.RuleEnginePool {
	msg := exchange.In.GetMsg()
	username := msg.Metadata.GetValue(constants.KeyUsername)
	if s, ok := service.UserRuleEngineServiceImpl.Get(username); !ok {
		exchange.In.SetError(fmt.Errorf("not found username=%s", username))
		return engine.DefaultPool
	} else {
		return s.Pool
	}
}

var AuthProcess = func(router endpointApi.Router, exchange *endpointApi.Exchange) bool {
	r := exchange.In.(*rest.RequestMessage)

	authorization := exchange.In.Headers().Get(constants.KeyAuthorization)
	if !config.Get().RequireAuth && authorization == "" {
		//允许匿名访问
		r.Metadata.PutValue(constants.KeyUsername, config.C.DefaultUsername)
		return true
	}
	username := getUsernameApiKey(authorization) // "Bearer api_key" 方式
	if username != "" {
		r.Metadata.PutValue(constants.KeyUsername, username)
		return true
	} else {
		claim, err := parseToken(authorization) // "Bearer jwt" 方式
		if err != nil {
			exchange.Out.SetStatusCode(http.StatusUnauthorized)
			exchange.Out.SetBody([]byte(err.Error()))
			return false
		}
		r.Metadata.PutValue(constants.KeyUsername, claim.Username)
		return true
	}

}

func GetComponentsFromMarketplace(baseUrl, keywords string, root *bool, currentPage, size int) (ComponentList, error) {
	// 构造查询参数
	params := url.Values{}
	params.Add(constants.KeyKeywords, keywords)
	params.Add(constants.KeyPage, strconv.Itoa(currentPage))
	params.Add(constants.KeySize, strconv.Itoa(size))
	if root != nil {
		params.Add(constants.KeyRoot, strconv.FormatBool(*root))
	}

	// 拼接完整的 URL
	fullURL := baseUrl + "?" + params.Encode()

	// 发送 GET 请求
	resp, err := http.Get(fullURL)
	if err != nil {
		return ComponentList{}, err
	}
	var componentList ComponentList
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return ComponentList{}, err
	}
	if resp.StatusCode != http.StatusOK {
		return ComponentList{}, errors.New(string(body))
	}
	err = json.Unmarshal(body, &componentList)
	if err != nil {
		return ComponentList{}, err
	}
	return componentList, nil
}

func parseToken(token string) (*RuleGoClaim, error) {
	length := len(token)
	if length == 0 || length <= 7 {
		return nil, ErrIllegalToken
	}
	token = token[len(constants.KeyBearer):]
	claims := &RuleGoClaim{}
	tk, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.C.JwtSecretKey), nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := tk.Claims.(*RuleGoClaim); ok && tk.Valid {
		return claims, nil
	} else {
		return nil, fmt.Errorf("token is invalid")
	}
}

func (c *base) Login(url string) endpointApi.Router {
	return endpoint.NewRouter().From(url).Process(func(router endpointApi.Router, exchange *endpointApi.Exchange) bool {
		msg := exchange.In.GetMsg()
		var user model.User
		if err := json.Unmarshal([]byte(msg.Data), &user); err != nil {
			exchange.Out.SetStatusCode(http.StatusBadRequest)
			exchange.Out.SetBody([]byte(err.Error()))
		} else {
			user.Username = strings.TrimSpace(user.Username)
			user.Password = strings.TrimSpace(user.Password)
			if b := validatePassword(user); b {
				claim := RuleGoClaim{
					Username: user.Username,
					StandardClaims: jwt.StandardClaims{
						ExpiresAt: time.Now().Add(time.Duration(config.C.JwtExpireTime) * time.Millisecond).Unix(), // 设置 Token 过期时间
						Issuer:    config.C.JwtIssuer,                                                              // 设置 Token 的签发者
					},
				}
				token, err := createToken(claim)
				if err != nil {
					exchange.Out.SetStatusCode(http.StatusInternalServerError)
					exchange.Out.SetBody([]byte(err.Error()))
				}
				result, err := json.Marshal(map[string]interface{}{
					"token":     *token,
					"expiresAt": claim.ExpiresAt,
				})
				if err != nil {
					exchange.Out.SetStatusCode(http.StatusInternalServerError)
					exchange.Out.SetBody([]byte(err.Error()))
				} else {
					exchange.Out.SetBody(result)
				}
				return true

			} else {
				return unauthorized(user.Username, exchange)
			}
		}
		return true
	}).End()
}

func createToken(claim jwt.Claims) (*string, error) {
	// 创建 JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	tokenString, err := token.SignedString([]byte(config.Get().JwtSecretKey))
	if err != nil {
		fmt.Printf("Error generating token: %v\n", err)
		return nil, err
	}
	return &tokenString, nil
}

func validatePassword(user model.User) bool {
	return service.UserServiceImpl.CheckPassword(user.Username, user.Password)
}
func getUsernameApiKey(token string) string {
	length := len(token)
	if length == 0 || length <= 7 {
		return ""
	}
	return service.UserServiceImpl.GetUsernameByApiKey(token[len(constants.KeyBearer):])
}
