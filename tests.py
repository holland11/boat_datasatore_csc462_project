import concurrent.futures
import requests
import threading
import time
from csv import reader


thread_local = threading.local()

url = 'http://localhost:80/api/write/mongo/part/'
num_duplicates = 30
num_threads = 5


def get_session():
	if not hasattr(thread_local, "session"):
		thread_local.session = requests.Session()
	return thread_local.session
		
def send_req(data):
	session = get_session()
	with session.post(url, data=data) as response:
		#print(response)
		a=1
		
def send_all_requests(postData):
	with concurrent.futures.ThreadPoolExecutor(max_workers=num_threads) as executor:
		executor.map(send_req, postData)

def getPostData():
	postData = []
	with open("trimmed.csv", "r") as f:
		i = 0
		col_headers = []
		for line in reader(f):
			if (i == 0):
				col_headers = line
				i += 1
				continue
			data = dict(zip(col_headers, line))
			temp = []
			for k in data:
				if (data[k] == ''):
					temp += [k]
			for k in temp:
				del data[k]
			if ("Size" not in data): 
				data["Size"] = "0"
			for j in range(num_duplicates):
				temp = data.copy()
				temp["Size"] += str(j)
				postData += [temp]
	return postData
		
def main():
	postData = getPostData()
	start_time = time.time()
	send_all_requests(postData)
	duration = time.time() - start_time
	print(f"Sent {len(postData)} requests in {duration} seconds")
	return
	start_time = time.time()
	download_all_sites(sites)
	duration = time.time() - start_time
	print(f"Downloaded {len(sites)} in {duration} seconds")

if __name__ == "__main__":
	main()