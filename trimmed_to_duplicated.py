'''
Program that takes a csv as input and returns a csv as output.
The output csv will have duplicated rows from the input csv, but at least
	one column will be slightly modified for each duplicate so they aren't identical.
'''

import csv
import random

num_duplicates = 200 # 200 = 2,500 rows -> 500,000 rows

def main():
    with open('trimmed.csv') as csv_in:
        csv_read = csv.reader(csv_in, delimiter=",")
        
        with open('duplicated.csv', 'w') as csv_out:
            csv_reader = csv.reader(csv_in, delimiter=",")
            csv_writer = csv.writer(csv_out, delimiter=',')
            line_count = 0
            for row in csv_reader:
                if line_count == 0:
                    csv_writer.writerow(row)
                    line_count += 1
                    j = 0
                    for col_header in row:
                        print('{}: {}'.format(j, col_header))
                        j += 1
                    continue
				
                csv_writer.writerow(row) # write original
                
                for i in range(num_duplicates):
                    multiplier = (random.random() * 0.2) + 0.85 # random number between 0.85 -> 1.15
                    new_row = row.copy()
                    new_row[4] = new_row[4] + ' ({})'.format(i) # 4: Features (name of item)
                    csv_writer.writerow(new_row)
                    #new_row[14] = new_row[14]*multiplier # 14: Unit Measurement (Feet)
                    #new_row[
                    
                line_count += 1
                
if __name__ == "__main__":
	main()