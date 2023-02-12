group default {
  targets = ["user"]
}

variable "GITHUB_SHA" {
  default = "latest"
}

variable "REGISTRY" {
  default = "car.daoyi365.com:5000"
}

target "tk-node" {
  target     = "tk-node"
  cache-from = ["type=gha,scope=tk-node"]
  cache-to   = ["type=gha,mode=max,scope=tk-node"]
}

target "user" {
  contexts = {
    tk-node = "target:tk-node",
  }
  args = {
    name = "user"
  }
  tags = [
    "${REGISTRY}/user:${GITHUB_SHA}",
  ]
  cache-from = ["type=gha,scope=user"]
  cache-to = ["type=gha,mode=max,scope=user"]
}