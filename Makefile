target: run_socket run_client

run_socket:
	npm --prefix ./back run build
	npm --prefix ./back run start

run_client:
	npm --prefix ./front run dev