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
                temp = temp[:7] + temp[8:]
                temp = temp[:3] + temp[4:]
                temp[15] = temp[15][0:-1] # "Preferred MFG." to "Preferred MFG"
                temp = temp[:2] + temp[3:]
                temp = temp[:21] + temp[22:]
                temp = temp[:8] + temp[9:]
                temp = temp[:6] + temp[7:]
                temp = temp[:4] + temp[5:]
                temp = temp[:4] + temp[12:] 
                temp[14] = "Transverse Moment"
                temp[16] = "Material And Color"
                temp[7] = "Weight"
                temp = temp[:9] + temp[10:]
                temp = temp[:9] + temp[15:]
                temp = temp[:2] + temp[3:]
                temp = temp[:7] + temp[8:]
                for i in range(len(temp)):
                    temp[i] = temp[i].replace(' ', '_') # replace spaces with underscores
                    print('{}: {}'.format(i,temp[i]))
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
                temp = temp[:7] + temp[8:] # 2/2522 7:GCMNA Scope
                temp = temp[:3] + temp[4:] # 15/2522 3:GCMNA Code
                temp = temp[:2] + temp[3:] # 105/2522 2:Check Item
                temp = temp[:21] + temp[22:] # 21:% of Parent Weight
                temp = temp[:8] + temp[9:] # 8:Places to reduce from 38 Meter
                temp = temp[:6] + temp[7:] # 6:Update Status
                temp = temp[:4] + temp[5:] # 4:Selected Item
                temp = temp[:4] + temp[12:]				
					# 4:GCMNA Point Person  5:History  6:Builder  ID Number  7:Location  8:Category  9:Electrical  10:Unit Measurement (Feet)  11:Preferred MFG
                temp = temp[:9] + temp[10:] # 9: Weight_Total_(LBS)
                temp = temp[:9] + temp[15:]
					# 9: LCG 10: TCG 11: VCG 12: Longitudinal_Moment 13: Transverse_Moment 14: Vertical_Moment
                temp = temp[:2] + temp[3:] # 2: Sorting_Nature_of_Info_Produced
                temp = temp[:7] + temp[8:] # 7: Quantity
                row = temp
                spec_items.append(row)
                if (row[3] == ''): continue # Features column is empty so we skip (2/2522 rows have this empty)
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
                
        print('\n\t---Headings---')
        
        for i in range(len(col_headers)):
            print('{}:{}'.format(i, col_headers[i]),end='    ')
        print()
        print('\n\t---First 7 rows---')
        for row in spec_items[:7]:
            print(row)
        print('\n\t---Misc---')    
        print('{}'.format(col_count))
        print('total rows: {} item spec rows: {}'.format(line_count, len(spec_items)))
        
        sorted_index_order = list(range(len(col_count)))
        col_count, sorted_index_order = (list(t) for t in zip(*sorted(zip(col_count, sorted_index_order), reverse=True)))
        
        
        print('\n\t---Sorted---')
        print(sorted_index_order)
        print(col_count)
        
        
    return
    
if __name__ == "__main__":
    main()