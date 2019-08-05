package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"strings"
	"encoding/csv"
	"log"
	"strconv"
	"encoding/json"
	"net/http"
	"bytes"
	"time"
)

const (
	num_duplicates = 30
	num_threads = 5
	url = "http://localhost:80/api/write/mongo/part/"
	//url = "http://localhost:3000/api/test/"
)

func check(err error) {
	if (err != nil) {
		panic(err)
	}
}

func csvToMap(filename string) [][]byte {
	dat, err := ioutil.ReadFile(filename)
	check(err)
	r := csv.NewReader(strings.NewReader(string(dat)))
	
	i := 0
	var col_headers []string
	var postData [][]byte
	
	for {
		record, err := r.Read()
		if (err == io.EOF) {
			break
		}
		if (err != nil) {
			log.Fatal(err)
		}
		if (i == 0) {
			i++
			col_headers = record
			continue
		}
		temp := make(map[string]string)
		for i := range(record) {
			if (record[i] == "") {
				continue
			}
			temp[col_headers[i]] = record[i]
		}
		if _, ok := temp["Size"]; !ok {
			temp["Size"] = "0"
		}
		for i:=0; i<num_duplicates; i++ {
			temp2 := make(map[string]string)
			for k,v := range temp {
				temp2[k] = v
			}
			temp2["Size"] = temp2["Size"] + strconv.Itoa(i)
			jsonStr, err := json.Marshal(temp2)
			if err != nil {
				panic(err)
			}
			postData = append(postData, jsonStr)
		}
		i++
	}
	return postData
}

func sendPostRequest(jsonStr []byte, workerChan chan int) {
	for {
		req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
		req.Header.Set("Content-Type", "application/json")
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			fmt.Println(string(jsonStr))
			continue
		}
		
		//fmt.Println("response Status:", resp.Status)
		//fmt.Println("response Headers:", resp.Header)
		//body, _ := ioutil.ReadAll(resp.Body)
		//fmt.Println("response Body:", string(body))
		resp.Body.Close()
		break
	}
	workerChan <- 1
}

func main() {
	/*
	Desktop:
	1 thread 5 num_duplicates:
		12610
		Took 19.8334984s
		12610
		Took 18.7458853s
	Local Swarm:
	20 threads 10 duplicates:
		25220
		Took 2m46.5356344s
	1 thread 10 duplicates:
		25220
		Took 3m17.2215777s
	5 thread 30 duplicates:
		75660
		Took 11m5.2181336s
	
	Laptop(unplugged):
	5 thread 5 num_duplicates:
		12610
		Took 40.0800154s
		12610
		Took 41.6356452s
	1 thread 5 num_duplicates:
		12610
		Took 55.7167471s
	20 thread 5 num_duplicates:
		12610
		Took 40.7239064s
	*/
	postData := csvToMap("trimmed.csv")
	fmt.Println(len(postData))
	
	workerChan := make(chan int, num_threads)
	for i:=0; i<num_threads; i++ {
		workerChan <- 1
	}
	
	start := time.Now()
	
	for _,jsonStr := range postData {
		<- workerChan
		go sendPostRequest(jsonStr, workerChan)
	}
	
	elapsed := time.Since(start)
	fmt.Printf("Took %s\n", elapsed)
}