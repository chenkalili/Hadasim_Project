import math

def print_triangular(height, width):
    middle_rows = int(height - 2)
    skips = int((width - 3) / 2)
    bottom_rows = int(middle_rows / skips)
    top_rows = int(middle_rows - ((skips - 1) * bottom_rows))
    start = 1
    spaces = int((width - start) / 2)

    print(" " * spaces + "*" * start)
    start += 2
    spaces = int((width - start) / 2)
    for begin in range(top_rows):
        print(" " * spaces + "*" * start)
    for middle in range(skips - 1):
        start += 2
        spaces = int((width - start) / 2)
        for s in range(bottom_rows):
            print(" " * spaces + "*" * start)
    print("*" * width)

def get_tower_dimensions():
    while True:
        try:
            height = int(input("Enter the height of the tower: "))
            width = int(input("Enter the width of the tower: "))
            # Checking if the height is greater than or equal to 2
            if height < 2:
                print("Invalid input: Height must be greater than or equal to 2.")
            else:
                return height, width
        except ValueError:
            print("Invalid input: Please enter integers for height and width.")


def rectangular_tower():
    height, width = get_tower_dimensions()
    area = height * width
    if height == width:
        print(f"The area of the square tower is {area}.")
    elif abs(height - width) > 5:
        print(f"The area of the rectangular tower is {area}.")
    else:
        perimeter = 2 * (height + width)
        print(f"The perimeter of the rectangle is {perimeter}.")

def triangular_tower():
    height, width = get_tower_dimensions()
    print("Menu:")
    print("1. Calculate the perimeter of the triangle")
    print("2. Print the triangle")
    choice = int(input("Enter your choice: "))
    side = math.sqrt(height ** 2 + (width - 1) ** 2 / 4)
    if choice == 1:
        perimeter = 2 * side + width
        print(f"The perimeter of the isosceles triangle is {perimeter:.2f}.")
    if choice == 2:
        if width % 2 == 0 or width > 2 * height:
            print("The triangle cannot be printed.")
        else:
            print_triangular(height, width)


while True:
    print("Menu:")
    print("1. Rectangular tower")
    print("2. Triangular tower")
    print("3. Exit")
    choice = int(input("Enter your choice: "))
    if choice == 1:
        rectangular_tower()
    elif choice == 2:
        triangular_tower()
    elif choice == 3:
        break
    else:
        print("Invalid choice. Please enter 1, 2, or 3.")




