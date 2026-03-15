MongoDB Import Guide for Beginners
===================================

This guide explains how someone with no prior MongoDB experience can import JSON files into a MongoDB database step by step. 
JSON files are included in the folder "exported_db_files".


1. Install MongoDB Database Tools
----------------------------------
First, make sure the MongoDB Database Tools are installed so that the mongoimport command can be used.

🔗 Download link:
https://www.mongodb.com/try/download/database-tools

After installation, open a terminal (CMD or PowerShell) and run:

    mongoimport --version

If you receive an error like "not recognized", proceed to step 1.1 below.


1.1 mongoimport Not Recognized? – Set PATH
-------------------------------------------

1. Navigate to the installation folder (usually located at):

    C:\Program Files\MongoDB\Database Tools\<version>\bin

   Example:
    C:\Program Files\MongoDB\Database Tools\100\bin

2. Make sure you can see mongoimport.exe inside the folder.

3. Copy the full path to that folder. Then:

   - Open Start menu → Search "Environment Variables" → Click "Edit system environment variables"
   - In the System Properties window, click "Environment Variables"
   - Under "System variables", find and select "Path" → Click "Edit"
   - Click "New" and paste the copied folder path
   - Click OK on all open dialogs to save

4. Close and reopen CMD or PowerShell. Now run:

    mongoimport --version

This should now work correctly.


2. Prepare the JSON File
--------------------------
The provided .json file (e.g. prediction_history.json) contains the collection data to be imported into MongoDB.

You will use this file in the next step.


3. Start MongoDB (For Local Installations)
-------------------------------------------
If MongoDB is installed locally, make sure the MongoDB service is running.

Windows:
- Open "Services" from Start Menu → Find "MongoDB" → Right-click → Start

Or in CMD:

    net start MongoDB

macOS/Linux:

    sudo systemctl start mongod


4. Import Data Using mongoimport
----------------------------------
Use the following command to import your JSON file into MongoDB:

    mongoimport --db=medicheck --collection=PredictionHistory --file=prediction_history.json --jsonArray --drop

Explanation:
- --db: Target database name (e.g. medicheck)
- --collection: Target collection name (e.g. PredictionHistory)
- --file: Path to your JSON file
- --jsonArray: Required if the JSON file contains an array (i.e. starts with [ ... ])
- --drop: Deletes the existing collection before importing (optional)


5. View in MongoDB Compass (Optional)
--------------------------------------
To visually inspect your data, use MongoDB Compass:

🔗 https://www.mongodb.com/try/download/compass

Use this connection URI in Compass:

    mongodb://localhost:27017

Once connected, you can browse the "medicheck" database and the "PredictionHistory" collection.


If you have any questions, please contact the project developers.