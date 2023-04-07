group default {
  targets = ["tk-node", "api", "backend", "user", "token", "sms", "captcha", "system", "site", "ledger", "payment", "file", "migration", "apid"]
}

group push {
  targets = ["api", "backend", "user", "token", "sms", "captcha", "system", "site", "ledger", "payment", "file", "migration", "apid"]
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
  target = "node-service"
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

target "backend" {
  target = "node-service"
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "backend"
  }
  tags = [
    tag_name("backend"),
  ]
  cache-from = ["type=gha,scope=backend"]
  cache-to   = ["type=gha,mode=max,scope=backend"]
}

target "user" {
  target = "node-service"
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
  target = "node-service"
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
  target = "node-service"
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
  target = "node-service"
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
  target = "node-service"
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
  target = "node-service"
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

target "site" {
  target = "node-service"
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "site"
  }
  tags = [
    tag_name("site"),
  ]
  cache-from = ["type=gha,scope=site"]
  cache-to   = ["type=gha,mode=max,scope=site"]
}

target "ledger" {
  target = "node-service"
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "ledger"
  }
  tags = [
    tag_name("ledger"),
  ]
  cache-from = ["type=gha,scope=ledger"]
  cache-to   = ["type=gha,mode=max,scope=ledger"]
}

target "payment" {
  target = "node-service"
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "payment"
  }
  tags = [
    tag_name("payment"),
  ]
  cache-from = ["type=gha,scope=payment"]
  cache-to   = ["type=gha,mode=max,scope=payment"]
}

target "file" {
  target = "node-service"
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "file"
  }
  tags = [
    tag_name("file"),
  ]
  cache-from = ["type=gha,scope=file"]
  cache-to   = ["type=gha,mode=max,scope=file"]
}

target "tk-go" {
  target = "tk-go"
  cache-from = ["type=gha,scope=tk-go"]
  cache-to   = ["type=gha,mode=max,scope=tk-go"]
  tags = [
    "tk-go"
  ]
}

target "tk-go-build" {
  target = "tk-go-build"
  contexts = {
    tk-go = "target:tk-go"
  }
  cache-from = ["type=gha,scope=tk-go-build"]
  cache-to   = ["type=gha,mode=max,scope=tk-go-build"]
  tags = [
    "tk-go-build"
  ]
}

target "apid" {
  target = "go-service"
  contexts = {
    tk-go-build = "target:tk-go-build"
  }
  cache-from = ["type=gha,scope=go-service"]
  cache-to   = ["type=gha,mode=max,scope=go-service"]
  tags       = [tag_name("apid")]
}