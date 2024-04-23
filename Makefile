target: run_socket run_client

run_socket:
	npm --prefix ./back run dev

run_client:
	npm --prefix ./front run dev

