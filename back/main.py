from Parser import Parser
from datetime import date


start = date(2024, 3, 17)
end = date(2025, 4, 17)

p = Parser()
p.parse_dataset('EUR', start, end)
