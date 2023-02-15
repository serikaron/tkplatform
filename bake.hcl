group default {
  targets = ["tk-node", "api", "user", "token", "sms", "captcha", "system", "migration"]
}

group push {
  targets = ["api", "user", "token", "sms", "captcha"]
}

variable "GITHUB_SHA" {
  default = "latest"
}

variable "REGISTRY" {
  default = "car.daoyi365.com:5000"
}

function tag_name {
  params = [server_name]
  result = "${REGISTRY}/tk-${server_name}"
}

target "tk-node" {
  target     = "tk-node"
  cache-from = ["type=gha,scope=tk-node"]
  cache-to   = ["type=gha,mode=max,scope=tk-node"]
  tags       = ["tk-node"]
}

target "api" {
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "api"
  }
  tags = [
    tag_name("api"),
  ]
  cache-from = ["type=gha,scope=api"]
  cache-to   = ["type=gha,mode=max,scope=api"]
}

target "user" {
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "user"
  }
  tags = [
    tag_name("user"),
  ]
  cache-from = ["type=gha,scope=user"]
  cache-to   = ["type=gha,mode=max,scope=user"]
}

target "token" {
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "token"
  }
  tags = [
    tag_name("token"),
  ]
  cache-from = ["type=gha,scope=token"]
  cache-to   = ["type=gha,mode=max,scope=token"]
}

target "sms" {
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "sms"
  }
  tags = [
    tag_name("sms"),
  ]
  cache-from = ["type=gha,scope=sms"]
  cache-to   = ["type=gha,mode=max,scope=sms"]
}

target "captcha" {
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "captcha"
  }
  tags = [
    tag_name("captcha"),
  ]
  cache-from = ["type=gha,scope=captcha"]
  cache-to   = ["type=gha,mode=max,scope=captcha"]
}

target "system" {
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "system"
  }
  tags = [
    tag_name("system"),
  ]
  cache-from = ["type=gha,scope=system"]
  cache-to   = ["type=gha,mode=max,scope=system"]
}

target "migration" {
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "migration"
  }
  tags = [
    tag_name("migration"),
  ]
  cache-from = ["type=gha,scope=migration"]
  cache-to   = ["type=gha,mode=max,scope=migration"]
}