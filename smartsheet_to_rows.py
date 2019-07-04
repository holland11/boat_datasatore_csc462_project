import csv

def main():
    with open('smartsheet.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=",")
        line_count = 0
        col_headers = []
        spec_items = []
        col_count = []
        current_heading = ''
        current_spec_heading = ''
        heading_count = {}
        spec_heading_count = {}
        for row in csv_reader:
            if (line_count == 0):
                temp = ['Heading', 'Spec Heading']
                temp.extend(row)
                temp = temp[:31] + temp[37:]
                temp = temp[:7]+ temp[8:]
                temp = temp[:3]+ temp[4:]
                temp[15] = temp[15][0:-1] # "Preferred MFG." to "Preferred MFG"
                row = temp
                col_headers = row
                for i in range(len(row)):
                    col_count.append(0)
            if (row[2] == 'Spec Item'):
                temp = [current_heading, current_spec_heading]
                if (current_heading in heading_count): heading_count[current_heading] += 1
                else: heading_count[current_heading] = 1
                if (current_spec_heading in spec_heading_count): spec_heading_count[current_spec_heading] += 1
                else: spec_heading_count[current_spec_heading] = 1
                temp.extend(row)
                temp = temp[:31] + temp[37:] # these were all empty for 2522/2522 spec item rows 
                    # 31:Document Number  32:Start Date  33:3D Model In Library  34:End Date  35:Duration  36:Predecessors
                temp = temp[:7]+ temp[8:] # 2/2522 7:GCMNA Scope
                temp = temp[:3]+ temp[4:] # 15/2522 3:GCMNA Code
                row = temp
                spec_items.append(row)
                for i in range(len(row)):
                    if (row[i] != ''):
                        col_count[i]+=1
            elif (row[2] == 'Heading'):
                current_heading = row[3]
            elif (row[2] == 'Spec Heading'):
                current_spec_heading = row[3]
                
            line_count+=1
            
        with open('trimmed.csv', mode='w') as outfile:
            csv_writer = csv.writer(outfile, delimiter=',')
            csv_writer.writerow(col_headers)
            for row in spec_items:
                csv_writer.writerow(row)
                
        print(f'\n\t---Headings---')
        
        for i in range(len(col_headers)):
            print(f'{i}:{col_headers[i]}',end='    ')
        print()
        print(f'\n\t---First 7 rows---')
        for row in spec_items[:7]:
            print(row)
        print(f'\n\t---Misc---')    
        print(f'{col_count}')
        print(f'total rows: {line_count} item spec rows: {len(spec_items)}')
        
        sorted_index_order = list(range(len(col_count)))
        col_count, sorted_index_order = (list(t) for t in zip(*sorted(zip(col_count, sorted_index_order), reverse=True)))
        
        
        print(f'\n\t---Sorted---')
        print(sorted_index_order)
        print(col_count)
        
        
    return
    
if __name__ == "__main__":
    main()