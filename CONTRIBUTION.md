# Contribution Guide

**Our mission is to build a next-generation rule engine that meets the needs of various scenarios and is committed to cultivating a vibrant component ecosystem, leading software development into a new innovation paradigm.**

Welcome to the RuleGo community! We are an open and inclusive team dedicated to advancing rule engine technology. We believe that through the power of the community, we can together achieve this vision.

## 2. Code of Conduct

We are committed to providing an open and inclusive community environment. Please adhere to our [Code of Conduct](https://developercertificate.org) when participating in this project.

## 3. Submitting/Handling Issues

- **Submit Issues**: Report bugs, request features, or make suggestions in [Github Issues](https://github.com/rulego/rulego-server/issues).
- **Join Discussions**: Participate in discussions of existing issues and share your thoughts and feedback.
- **Claim Issues**: If you are willing to handle a specific issue, assign it to yourself by commenting `/assign @yourself`.

## 4. Contributing Code

### 4.1 Detailed Steps for Submitting Pull Requests

1. **Check Existing PRs**: Search for related PRs in [Github Pull Requests](https://github.com/rulego/rulego-server/pulls) to avoid duplication.
2. **Discuss Design**: Before submitting a PR, discuss your design to ensure it meets the project's requirements.
3. **Sign DCO**: Use `git commit -s` to ensure each commit is signed with the [DCO](https://developercertificate.org).
4. **Fork Repository**: Fork and clone the rulego/rulego repository on Github.
5. **Create Branch**: `git checkout -b my-feature-branch main`.
6. **Write Code and Tests**: Add your code and corresponding test cases.
7. **Format Code**: Use the `gofmt -s -w .` command to format the code.
8. **Commit and Push**: Use `git add .` and `git commit -s -m "fix: add new feature"` to commit changes, then push to your forked repository.
9. **Create PR**: Create a PR on Github and ensure you provide a detailed PR description.

### 4.2 Compiling Source Code

#### 4.2.1 Supported Platforms
- All operating systems that support the Go language.

#### 4.2.2 Compilation Environment Information
- Go version: v1.23+
- Git: [Download Git](https://git-scm.com/downloads)

#### 4.2.3 GO Environment Variable Settings (Optional)
```bash
# Set GOPATH (customizable directory)
export GOPATH=$HOME/gocodez
export GOPROXY=https://goproxy.cn,direct
export GO111MODULE=on
export GONOSUMDB=*
export GOSUMDB=off
```

#### 4.2.4 Download and Compile Source Code
```bash
git clone git@github.com:<username>/rulego.git
# Compile
go build .
# Or compile with extension components
go build -tags "with_extend,with_ai,with_ci,with_iot,with_etl" .
```

### 4.3 Starting the Service
```bash
./server -c ./config.config
```

## 5. Other Ways to Contribute to the Community

### 5.1 Contributing Extension Components
- [rulego](https://github.com/rulego/rulego): RuleGo core.
- [rulego-components](https://github.com/rulego/rulego-components): Other extension components.
- [rulego-components-ai](https://github.com/rulego/rulego-components-ai): AI scenario components.
- [rulego-components-ci](https://github.com/rulego/rulego-components-ci): CI/CD scenario components.
- [rulego-components-iot](https://github.com/rulego/rulego-components-iot): IoT scenario components.
- [rulego-components-etl](https://github.com/rulego/rulego-components-etl): ETL scenario components.
- [streamsql](https://github.com/rulego/streamsql): Subproject for enhancing edge computing aggregation capabilities.
- [rulego-marketplace](https://github.com/rulego/rulego-marketplace): Components marketplace.

### 5.2 Contributing Documentation
- Official Documentation: [rulego-doc](https://github.com/rulego/rulego-doc)