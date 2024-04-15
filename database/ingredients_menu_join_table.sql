CREATE TABLE "Ingredients_Menu"(
    ID SERIAL PRIMARY KEY,
    INGREDIENTS_ID SERIAL REFERENCES "Ingredient"(ID),
    MENU_ID SERIAL REFERENCES "Menu_Item"(ID),
    QUANTITY INT NOT NULL
);

INSERT INTO "Ingredients_Menu" (MENU_ID, INGREDIENTS_ID, QUANTITY)
VALUES
(1,1,1),        --Bacon Cheeseburger
(1,2,1),
(1,5,1),
(1,7,1),
(1,30,1),
(1,31,1),
(2,1,1),        --Classic Hamburger
(2,7,1),
(2,14,1),
(2,15,1),
(2,16,1),
(2,17,1),
(2,30,1),
(2,31,1),
(3,1,2),        --Double Stack Burger   
(3,5,2),
(3,7,1),
(3,16,1),
(3,19,1),
(3,30,1),
(3,31,1),
(4,1,1),        --Gig Em Patty Melt
(4,6,1),
(4,9,1),
(4,17,1),
(4,19,1),
(4,30,1),
(4,31,1),
(5,1,1),        --Cheeseburger
(5,5,1),
(5,7,1),
(5,16,1),
(5,19,1),
(5,30,1),
(5,31,1),
(6,3,1),        --Black Bean Burger
(6,7,1),
(6,14,1),
(6,15,1),
(6,16,1),
(6,17,1),
(6,30,1),
(6,31,1),
(7,1,1),        --Build your own (I assumed just noraml burger)
(7,7,1),
(7,14,1),
(7,15,1),
(7,16,1),
(7,17,1),
(7,30,1),
(7,31,1),
(8,4,1),        --Grilled Chicken Sandwhich
(8,7,1),
(8,14,1),
(8,17,1),
(8,30,1),
(8,31,1),
(9,4,1),        --Spicy Chicken Sandwhich
(9,7,1), 
(9,14,1), 
(9,20,1), 
(9,21,1),
(9,30,1),
(9,31,1), 
(10,2,1),       --Aggie Chicken Club
(10,4,1), 
(10,6,1), 
(10,7,1),
(10,18,1),
(10,30,1),
(10,31,1),
(11,11,2),      --2 Corn Dog Value Meal
(11,22,1),
(11,30,1),
(11,32,1),
(12,12,2),      --2 Hot Dog Value Meal
(12,22,1),
(12,30,1),
(12,32,1),
(13,10,3),      --3 Tender Entree
(13,30,1),
(13,32,1),
(14,10,3),      --3 Chicken Tender Combo
(14,13,1),
(14,27,1),
(14,30,1),
(14,32,1),
(15,13,1),      --French Fries
(15,30,1),
(16,23,1),      --Aggie Shakes
(16,28,1),
(16,29,1),
(16,30,1),
(17,23,1),      --Cookie Ice Cream Sundae
(17,24,2),   
(17,30,1), 
(17,31,1),    
(18,23,2),      --Double Scoop Ice Cream
(18,30,1),  
(18,31,1),  
(19,23,1),      --Root Beer Float
(19,27,1), 
(19,28,1),
(19,29,1),
(20,25,1),      --16 OZ Aquafina
(21,26,1),      --20 OZ Aquafina
(22,27,1),       --Fountain Drink
(22,28,1),
(22,29,1)