**Knowledge Base Sync**

Used to import questions from a file to botpress

`yarn start --api="" --bot="" --email="" --password="" --file=""`

| Arg        | Description           | Example  |
| ------------- |:-------------:| -----:|
| --api | botpress api base url | https://1.2.3.4:3000/api/v1 |
| --bot | botpress bot id      |   my-bot |
| --file | file containing questions      |    /test-file.xlsx |
| --email | botpress admin login info     |    username |
| --password | botpress admin login info      |    password |

**Execl files**
* File must have an Intent, Question, Answers and Category columns;
* File should have only questions sheets
* Sheet name should be language name i.e 'Arabic', 'English'
