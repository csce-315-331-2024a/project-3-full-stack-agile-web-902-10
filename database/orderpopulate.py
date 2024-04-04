import random
from datetime import datetime, timedelta

# Menu items and their prices with menu ids
menu = {
    1: {'item': 'bacon cheeseburger', 'price': 8.30},
    5: {'item': 'cheeseburger', 'price': 6.9},
    2: {'item': 'classic hamburger', 'price': 6.9},
    3: {'item': 'double stack burger', 'price': 9.99},
    4: {'item': 'gig em patty melt', 'price': 7.59},
    6: {'item': 'black bean burger', 'price': 8.38},
    7: {'item': 'build your own burger', 'price': 5.49},
    8: {'item': "rev's grilled chicken sandwich", 'price': 8.39},
    9: {'item': 'spicy chicken sandwich', 'price': 8.39},
    10: {'item': 'aggie sandwich club', 'price': 8.39},
    14: {'item': '3 chicken tender basket', 'price': 7.99},
    16: {'item': 'aggie shakes', 'price': 4.49},
    17: {'item': 'cookie ice cream sundae', 'price': 4.69},
    19: {'item': 'root beer float', 'price': 5.49},
    18: {'item': 'double scoop ice cream', 'price': 3.29},
    15: {'item': 'french fries', 'price': 1.99},
    11: {'item': '2 corn dog meal', 'price': 4.99},
    12: {'item': '2 hot dog meal', 'price': 4.99},
    13: {'item': '3 tender entree', 'price': 4.99},
    20: {'item': '16 oz auqafina', 'price': 1.79},
    21: {'item': '20 oz auqafina', 'price': 2.19},
    22: {'item': '20 oz fountain drink', 'price': 1.99}
}

# Initialize variables
start_date = datetime(2022, 8, 1)
customers = 1  # Starting customer ID
sample_list = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] #list of times REVS is open

# Create an SQL file to store the data
sql_filename = "customer_orders_1.sql"
with open(sql_filename, 'w') as sql_file:
    sql_file.write(f"INSERT INTO ORDER_MENU VALUES\n") #Writing the file header
    # Generate 52 weeks of orders
    for week in range(1, 105):
        for day in range(1, 8):
            current_date = start_date + timedelta(weeks=(week - 1), days=(day - 1))
            daily_customers = random.randint(30, 100)

            if current_date.strftime("%m%d") in ["0819", "0116"]:
                daily_customers = random.randint(80, 100) #make sure there is a high amount of existing daily customers
                daily_customers *= 4  # Increase customers fourfold on peak days

            for _ in range(daily_customers):
                items_ordered = random.sample(menu.keys(), random.randint(1, len(menu)))
                total_price = round(sum(menu[item]['price'] for item in items_ordered),2)

                # Ensure total price is between $3 and $50
                while not 3 <= total_price <= 50:
                    items_ordered = random.sample(menu.keys(), random.randint(1, len(menu)))
                    total_price = round(sum(menu[item]['price'] for item in items_ordered),2)

                # Generate random datetime and write order information to the SQL file
                order_datetime = current_date + timedelta( 
                    hours=random.choices(sample_list, weights=(5, 10, 20, 15, 10, 5, 5, 15, 25, 15, 10), k=1)[0], #gets a weighted random hour
                    minutes=random.randint(0, 59),
                    seconds=random.randint(0, 59)
                )

                formatted_datetime = order_datetime.strftime("%Y-%m-%d %H:%M:%S")
                menu_ids = ', '.join(map(str, items_ordered))
                sql_file.write(
                    f"({customers}, {total_price}, '{menu_ids}', '{formatted_datetime}'),\n"
                )
                customers += 1
