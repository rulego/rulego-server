// Package utils provides various utility functions for working with arrays.
package utils

// InArray 判断字符串是否在切片中（区分大小写）
// 线性遍历（适合小数据量）
// 时间复杂度O(n),空间复杂度O(1)
func InArray(target string, arr []string) bool {
	for idx := range arr {
		if arr[idx] == target {
			return true
		}
	}
	return false
}
