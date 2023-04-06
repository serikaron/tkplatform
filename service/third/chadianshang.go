package third

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"service/logger"
	"service/model"
)

const (
	ChaDianShangAppKey    = "56d5446ffb44714be3fec94a2f843ca2"
	ChaDianShangAppSecret = "Spark-Joe"
)

func CheckWangWang(wangwangName string) (*model.CheckSumResp, error) {
	client := &http.Client{}
	req, err := http.NewRequest("POST", "https://api.chadianshang2.com/api/check/checkNum?wangwang="+wangwangName, nil)
	if err != nil {
		log.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("appKey", ChaDianShangAppKey)
	req.Header.Set("appSecret", ChaDianShangAppSecret)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	bodyText, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n", bodyText)

	type CheckResult struct {
		Code string              `json:"code"`
		Msg  string              `json:"msg"`
		Data *model.CheckSumResp `json:"data"`
	}

	var result CheckResult
	err = json.Unmarshal(bodyText, &result)
	if err != nil {
		logger.Error(err)
		return nil, err
	}

	if result.Code != "0" {
		logger.Debug("查号失败：", result.Msg)
		return nil, errors.New(result.Msg)
	}

	return result.Data, nil
}
