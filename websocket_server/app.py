import json
import asyncio
import socketio
import uvicorn
from prisma import Prisma
from typing import TypedDict, List, Dict, Any

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
app = socketio.ASGIApp(sio)
prisma = Prisma()

class PayloadType(TypedDict):
    email: str
    jwt: str
    packet: List[Dict[str, Any]]

# These are called on websocket connect and disconnect

@sio.event
async def connect(sid, environ, auth):
    print('connect ', sid)
    menu_items = await prisma.menu_item.find_many()
    ingredients = await prisma.ingredient.find_many()
    await sio.emit('Menu_Item', jsonable(menu_items), to=sid)
    await sio.emit('Ingredient', jsonable(ingredients), to=sid)

@sio.event
async def disconnect(sid):
    print('disconnect ', sid)

# Helper to turn prisma return type into json encodble type aka somethin stringable
def jsonable(packet):
    return json.dumps([data.dict() for data in packet])
async def authorized(email: str, jwt: str) -> bool:
    user = await prisma.users.find_unique(where={'email': email} )
    print(user)
    if user.jwt != jwt:
        return False
    return user.is_manager

# CRUD operations

@sio.event
async def Ingredient_create(sid, packet):
    # Parse the JSON Text into a Python Dict(s)
    parsed_packet = json.loads(packet)
    # Check if the user is authorized
    if not await authorized(parsed_packet['name'], parsed_packet['jwt']):
        return
    # Do the CRUD operation
    await prisma.ingredient.create(parsed_packet['data'])
    # Get the updated data
    ingredients = await prisma.ingredient.find_many()
    # Emit the updated data to all clients
    await sio.emit('Ingredient', jsonable(ingredients))
    pass

@sio.event
async def Ingredient_read(sid, packet):
    return await prisma.ingredient.find_many()

@sio.event
async def Ingredient_update(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.ingredient.update(parsed_packet['data'])
    ingredients = await prisma.ingredient.find_many()
    await sio.emit('Ingredient', jsonable(ingredients))

@sio.event
async def Ingredient_destroy(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.ingredient.delete(parsed_packet['data'])
    ingredients = await prisma.ingredient.find_many()
    await sio.emit('Ingredient', jsonable(ingredients))

@sio.event
async def Ingredients_Menu_create(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.ingredients_menu.create(parsed_packet['data'])
    ingredients_menu = await prisma.ingredients_menu.find_many()
    await sio.emit('Ingredients_Menu', jsonable(ingredients_menu))

@sio.event
async def Ingredients_Menu_read(sid, packet):
    return await prisma.ingredients_menu.find_many()

@sio.event
async def Ingredients_Menu_update(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.ingredients_menu.update(parsed_packet['data'])
    ingredients_menu = await prisma.ingredients_menu.find_many()
    await sio.emit('Ingredients_Menu', jsonable(ingredients_menu))

@sio.event
async def Ingredients_Menu_destroy(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.ingredients_menu.delete(parsed_packet['data'])
    ingredients_menu = await prisma.ingredients_menu.find_many()
    await sio.emit('Ingredients_Menu', jsonable(ingredients_menu))

@sio.event
async def Login_Log_create(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.login_log.create(parsed_packet['data'])
    login_logs = await prisma.login_log.find_many()
    await sio.emit('Login_Log', jsonable(login_logs))

@sio.event
async def Login_Log_read(sid, packet):
    return await prisma.login_log.find_many()

@sio.event
async def Login_Log_update(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.login_log.update(parsed_packet['data'])
    login_logs = await prisma.login_log.find_many()
    await sio.emit('Login_Log', jsonable(login_logs))

@sio.event
async def Login_Log_destroy(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.login_log.delete(parsed_packet['data'])
    login_logs = await prisma.login_log.find_many()
    await sio.emit('Login_Log', jsonable(login_logs))

@sio.event
async def Menu_Item_create(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.menu_item.create(parsed_packet['data'])
    menu_items = await prisma.menu_item.find_many()
    await sio.emit('Menu_Item', jsonable(menu_items))

@sio.event
async def Menu_Item_read(sid, packet):
    return await prisma.menu_item.find_many()

@sio.event
async def Menu_Item_update(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.menu_item.update(parsed_packet['data'])
    menu_items = await prisma.menu_item.find_many()
    await sio.emit('Menu_Item', jsonable(menu_items))

@sio.event
async def Menu_Item_destroy(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.menu_item.delete(parsed_packet['data'])
    menu_items = await prisma.menu_item.find_many()
    await sio.emit('Menu_Item', jsonable(menu_items))

@sio.event
async def Order_Log_create(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.order_log.create(parsed_packet['data'])
    order_logs = await prisma.order_log.find_many()
    await sio.emit('Order_Log', jsonable(order_logs))

@sio.event
async def Order_Log_read(sid, packet):
    return await prisma.order_log.find_many()

@sio.event
async def Order_Log_update(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.order_log.update(parsed_packet['data'])
    order_logs = await prisma.order_log.find_many()
    await sio.emit('Order_Log', jsonable(order_logs))

@sio.event
async def Order_Log_destroy(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.order_log.delete(parsed_packet['data'])
    order_logs = await prisma.order_log.find_many()
    await sio.emit('Order_Log', jsonable(order_logs))

@sio.event
async def Users_create(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.users.create(parsed_packet['data'])
    users = await prisma.users.find_many()
    await sio.emit('Users', jsonable(users))

@sio.event
async def Users_read(sid, packet):
    return await prisma.users.find_many()

@sio.event
async def Users_update(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.users.update(parsed_packet['data'])
    users = await prisma.users.find_many()
    await sio.emit('Users', jsonable(users))

@sio.event
async def Users_destroy(sid, packet):
    parsed_packet = json.loads(packet)
    if not await authorized(parsed_packet['email'], parsed_packet['jwt']):
        return
    await prisma.users.delete(parsed_packet['data'])
    users = await prisma.users.find_many()
    await sio.emit('Users', jsonable(users))


# DO NOT TOUCH, this handles server creation and graceful exit
async def main():
    await prisma.connect()
    print("Connected to the packetbase.")

    try:
        config = uvicorn.Config(app, host="0.0.0.0", port=5000, log_level="info")
        await uvicorn.Server(config).serve()
    except:
        pass

    await prisma.disconnect()
    print("Disconnected from the packetbase.")

if __name__ == '__main__':
    asyncio.run(main())
