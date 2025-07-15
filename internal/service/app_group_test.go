package service

import (
	"log"
	"os"
	"reflect"
	"testing"
)

var ag *AppGroup

func TestMain(m *testing.M) {

	svc := &RuleEngineService{
		username: "rule-group-test1",
	}
	appGroup, err := NewAppGroup("owner", "group1", svc)
	if err != nil {
		log.Fatal(err)
	}

	ag = appGroup
	ag.AddMember("m1", Manager)
	ag.AddMember("m2", Manager)
	ag.AddMember("e1", Executer)
	ag.AddMember("e2", Executer)
	ag.AddMember("em3", Executer|Manager)

	mode, err := ag.GetMember("e3")
	if err != nil {
		log.Println(err)
	} else {
		log.Printf("%s:%s", "e3", mode)
		if mode.Has(Manager) {
			log.Println("e3 is a manager")
		} else {
			log.Println("e3 is not a manager")
		}
		if mode.Has(Executer) {
			log.Println("e3 is an executer")
		}
	}

	os.Exit(m.Run())
}

func TestAppGroup_getMembers(t *testing.T) {
	type args struct {
		flag ModeKind
	}
	tests := []struct {
		name string
		ag   *AppGroup
		args args
		want []string
	}{
		// TODO: Add test cases.
		{
			name: "test1",
			ag:   ag,
			args: args{
				flag: Manager,
			},
			want: []string{"em3", "m1", "m2", "owner"},
		},
		{
			name: "test2",
			ag:   ag,
			args: args{
				flag: Executer,
			},
			want: []string{"e1", "e2", "em3", "owner"},
		},
		{
			name: "test3",
			ag:   ag,
			args: args{
				flag: Enable,
			},
			want: []string{"e1", "e2", "em3", "m1", "m2", "owner"},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.ag.getMembers(tt.args.flag); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("AppGroup.getMembers() = %v, want %v", got, tt.want)
			}
		})
	}
}
