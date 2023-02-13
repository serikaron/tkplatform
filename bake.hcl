group default {
  targets = ["tk-node", "user", "token", "sms"]
}

variable "GITHUB_SHA" {
  default = "latest"
}

variable "REGISTRY" {
  default = "car.daoyi365.com:5000"
}

function tag_name {
  params = [server_name]
  result = "${REGISTRY}/tk-${server_name}:${GITHUB_SHA}"
}

target "tk-node" {
  target     = "tk-node"
  cache-from = ["type=gha,scope=tk-node"]
  cache-to   = ["type=gha,mode=max,scope=tk-node"]
  tags       = ["tk-node"]
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