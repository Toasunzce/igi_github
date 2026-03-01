from geometric_lib import circle
import os

r = float(os.environ["RADIUS"])

print(circle.area(r))