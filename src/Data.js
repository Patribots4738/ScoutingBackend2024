import { data } from "./SampleData.js";
import { Chart } from "react-google-charts";
import { getAllData } from "./widgets/JsonData.js";
import { fetchData } from "./SampleData.js";
import { async } from "@firebase/util";
import { assignMatchScoreToEach } from "./RankingSystem.js";
import { assignAllScores } from "./RankingSystem.js";
import { eventCode } from "./App.js";
// import { predictTeamScore } from "./MatchPredictor.js";
// import { predictTeamScore2 } from "./MatchPredictor2.js"
//const data = getAllData();


let rawData;
let commentData;
let numData;
let commentTeamMap;
let numTeamMap;
let bigTeamMap;
let allData;
let teamAverageMap;
let rankingTable;
let rankingsNumData;
let maxMin;
let maxMinOfAverages;
let rawDataMap;
let bigTeamMapSplit;
// Use an async function to fetch and process your data
// Working:
export const fetchDataAndProcess = async () => {

    const data = await getAllData();
    rawData = JSON.parse(data)["scouting"][eventCode];
    console.log(rawData);
    commentData = resortColumnByPoint(
        convertCommentsToTableForm(rawData),
        "Team",
        0
    );
    numData = convertNumDataToTableForm(rawData);
    numData = assignAllScores(numData);
    
    numData = resortColumnsByArray(numData, 
        [
            "Team",
            "Score",
            "Match Number",
            "Speaker",
            "Amp",
            "Auto",
            "Leave in Auto",
            "Amp Auto",
            "Speaker Auto",
            "Teleop",
            "Amp Teleop",
            "Speaker Teleop", 
            "Amped Speaker",
            "Fumbles Speaker",
            "Fumbles Amp",
            "Co-Op",
            "Driving",
            "Human Player",
            "Endgame",
            "End Park",
            "End Onstage",
            "Climb Failure",
            "Critical Failure",
            "Temp Failure", 
            "Trap"
        ]);
    commentData = resortColumnsByArray(commentData, 
        [
          "Team",
          "Match Number",
          "Name",
          "Auto Pieces",
          "Auto Description",
          "What They Did Bad", 
          "What They Did Well",
          "Additional Comments"
        ]);
    // console.log(numData);
    // console.log(numData[1]);
    maxMin = getMaxMin(numData);
    commentTeamMap = convertTableToMap(commentData);
    numTeamMap = convertToTeamMap(numData);
    teamAverageMap = getTeamAverageMap();  
    console.log(getTeamAverage("4738"));
    allData = resortColumnByPoint(convertAllToTableForm(rawData), "Team", 0);
    bigTeamMap = convertToTeamMap(allData);
    bigTeamMapSplit = [convertToTeamMap(numData), convertToTeamMap(commentData)];
    rawDataMap = convertTableToMap(numData);
    rankingTable = getRankingTable();
    maxMinOfAverages = getMaxMinOfAverages();
    // console.log(teamAverageMap.get("1323"));
    // console.log(predictTeamScore(
    // [
    //     teamAverageMap.get("1234"),
    //     teamAverageMap.get("2234"),
    //     teamAverageMap.get("4234")
    // ]
    // ))
    // console.log(predictTeamScore2(
    // [
    //     teamAverageMap.get("4234"),
    //     teamAverageMap.get("1234"),
    //     teamAverageMap.get("2234")
    // ]
    //     ))

    return {
        rawData: rawData,
        commentData: commentData,
        commentDataMap: convertTableToMap(commentData),
        numData: numData,
        numDataMap: convertTableToMap(numData),
        commentTeamMap: commentTeamMap,
        numTeamMap: numTeamMap,
        bigTeamMap: bigTeamMap,
        allData: allData,
        teamAverageMap: teamAverageMap,
        rawDataMap: rawDataMap,
        rankingTable: rankingTable,
        maxMin: maxMin,
        maxMinOfAverages: maxMinOfAverages,
        bigTeamMapSplit: bigTeamMapSplit
    };
};

const getTeamData = (team) => {
  return bigTeamMap.get(team);
};
const getTeamNumData = (team) => {
  // console.log(numTeamMap);
  if (numTeamMap.get(team) == undefined) {
    return [[], []];
  }
  return numTeamMap.get(team);
};
const getTeamCommentData = (team) => {
  return commentTeamMap.get(team);
};

// Working
function convertToTableForm(data, datatype) {
  let table = [];

  // rows of the table
  let row = getIndividualDatapoints(data);
  row[0].push("Team");
  row[1].push("Team");

  // push either commentData or numData datapoints
  // to first index of table (table[0])
  if (datatype == "comments") {
    row[0].push("Match Number");
    table.push(row[0]);
  } else {
    table.push(row[1]);
  }

  // Each Match
  const matches = Object.keys(data);

  // Starts at one because table[0] is dataPoints
  for (let i = 1; i <= matches.length; i++) {
    // matchData simplifies data down to each match
    const matchData = data[matches[i - 1]];
    const bots = Object.keys(matchData);
    for (let j = 0; j < bots.length; j++) {
      row = [];
      //  gets either num or comment data of each bot
      const botData = matchData[bots[j]][datatype];

      const dataKeys = Object.keys(botData);
      for (let k = 0; k < dataKeys.length; k++) {
        row.push(botData[dataKeys[k]]);
      }
      // console.log(bots[j]);
      // gets team number
      let teamNameStart = 0;
      for (let i = 0; i < bots[j].length; i++) {
        if (bots[j][i] == "-") {
          teamNameStart = i + 1;
        }
      }
      row.push(bots[j].substring(teamNameStart, bots[j].length));
      if (datatype == "comments") {
        row.push(matchData[bots[j]]["data"]["Match Number"]);
      }
      table.push(row);
    }
  }
  // console.log(table);

  return table;
}
// Working:
function convertCommentsToTableForm(data) {
  return convertToTableForm(data, "comments");
}
// Working:
function convertNumDataToTableForm(data) {
  // console.log(convertToTableForm(data, "data"));
  return convertToTableForm(data, "data");
}

// Working:
function convertAllToTableForm(data) {
  console.log(data);
  let tempComments = convertCommentsToTableForm(data);
  let tempNumData = convertNumDataToTableForm(data);
  let table = [];
  tempComments[0].pop();
  table.push([tempComments[0], tempNumData[0]].flat());
  console.log(table);
  table[0].pop();
  // console.log(table);
  for (let i = 0; i < tempComments.length - 1; i++) {
    tempComments[i + 1].pop();
    table.push([tempComments[i + 1], tempNumData[i + 1]].flat());
    table[i + 1].pop();
  }
  // console.log(table);
  return table;
}
function getMaxMin(data) {
    let sol = new Map();
    if (data.length == 0) {
        return sol;
    }
    for (let i = 0 ; i < data[0].length; i++) {
        sol.set(data[0][i], [data[1][i], data[1][i]]);
    }
    for (let i = 2; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (parseFloat(data[i][j]) < parseFloat(sol.get(data[0][j])[0])) {
                sol.set(data[0][j], [data[i][j], sol.get(data[0][j])[1]]);
            }
            if (parseFloat(data[i][j]) > parseFloat(sol.get(data[0][j])[1])) {
                sol.set(data[0][j], [sol.get(data[0][j])[0], data[i][j]])
            }
        }
    }
    console.log(sol);
    return sol;
}

function getMaxMinOfAverages() {
    let arr = [];
    console.log(teamAverageMap);
    let keys = Array.from(teamAverageMap.keys());
    console.log(keys);
    arr.push(teamAverageMap.get(keys[0])[0]);
    for (let i = 0; i < keys.length; i++) {
        arr.push(getTeamAverage(keys[i])[1]);
    } 
    console.log(arr);
    return getMaxMin(arr);
}



// Working but need to make easier to use:
function resortColumn(data, columnInitial, columnGoal) {
  let table = [];
  let row = [];
  // console.log(data);
  for (let i = 0; i < data.length; i++) {
    row = [...data[i]];
    let temp = row[columnInitial];
    row[columnInitial] = row[columnGoal];
    row[columnGoal] = temp;
    table.push(row);
  }
  // console.log(table);
  return table;
}

// Working but EXTREMELY INEFFICIENT?
export function resortColumnsByArray(data, orderArr) { 
  console.log(data);
  let newData = [...data];
  for (let i = 0; i < orderArr.length; i++) {
    newData = resortColumnByPoint(newData, orderArr[i], i);
  }
  return newData;
}

// Working but need to make easier to use:
function resortColumnByPoint(data, point, columnGoal) {
  // console.log(data);
  for (let i = 0; i < data[0].length; i++) {
    if (data[0][i] == point) {
      // console.log(resortColumn(data, i, columnGoal));
      return resortColumn(data, i, columnGoal);
    }
  }
  return data;
}

function getRankingDisplayData() {

}


function renameHeader(data, headerInitial, headerFinal) {
    for (let i = 0; i < data[0].length; i++) {
        if (data[0][i] == headerInitial) {
            data[0][i] = headerFinal;
            break;
        }
    }
}

function removeDataPoint(data, dataPoint) {
    let newTeamData = [];
    for (let j = 0; j < data.length; j++) {
      newTeamData.push([]);
      for (let i = 0; i < data[j].length; i++) {
        if (data[0][i] != dataPoint) {
          newTeamData[j].push(data[j][i]);
        }
      }
    }
    return newTeamData;
}

function removeDataPoints(data, dataPointArr) {
    let newData = [...data];
    for (let i = 0; i < dataPointArr; i++) {
        newData = removeDataPoint(newData, dataPointArr[i]);
    }
}
// Working
function convertTableToMap(data) {
  let mapArr = [];

  // console.log(data);
  for (let i = 1; i < data.length; i++) {
    let map = {};
    // console.log(data[i]);
    for (let j = 0; j < data[i].length; j++) {
      // console.log(j);
      // console.log(data[0][j]);
      map[data[0][j]] = data[i][j];
    }
    mapArr.push(map);
  }
  // console.log(mapArr);
  return mapArr;
}
// Working
function getRankingTable() {
  let dataArr = [];
  let teams = Array.from(bigTeamMap.keys());
  for (let i = 0; i < teams.length; i++) {
    dataArr.push(convertTableToMap(getTeamAverage(teams[i]))[0]);
  }
  return dataArr;
}


// Working:
function getIndividualDatapoints(data) {
  let dataPoints = [[], []];

  //gets all the matches
  let matchKeys = Object.keys(data);
  // console.log(matchKeys);

  // if there are no matches, return empty table
  if (matchKeys.length == 0) {
    return dataPoints;
  }

  // gets all the data points using the data from the first bot in the first match
  // matchKeys[0] is the first match
  // Object.keys(data[matchKeys[0]])[0] is the first bot in the first match

  let botKeys = Object.keys(data[matchKeys[0]]);

  let commentPoints = Object.keys(data[matchKeys[0]][botKeys[0]]["comments"]);

  let numDataPoints = Object.keys(data[matchKeys[0]][botKeys[0]]["data"]);

  // pushes those data points to the first row of the table (the header)
  for (let i = 0; i < commentPoints.length; i++) {
    dataPoints[0].push(commentPoints[i]);
  }
  for (let i = 0; i < numDataPoints.length; i++) {
    dataPoints[1].push(numDataPoints[i]);
  }
  // console.log(dataPoints);
  return dataPoints;
}

// Working:
function convertToTeamMap(data) {
  let teamMap = new Map();
  // const points = getIndividualDatapoints(rawData);
  let teamNameIndex = 0;
  if (data.length == 0) {
    return {};
  }
  const points = data[0];
  for (let i = 0; i < data[0].length; i++) {
    if (points[i] == "Team") {
      teamNameIndex = i;
      break;
    }
  }
    // console.log(teamNameIndex);
    for (let i = 1; i < data.length; i++) {
        if (!teamMap.has(data[i][teamNameIndex])) {
            teamMap.set(data[i][teamNameIndex], [data[0], data[i]]);
        } else {
            teamMap.get(data[i][teamNameIndex]).push(data[i]);
        }
    }
    // console.log(teamMap);
    console.log(teamMap);
    return teamMap;
}

// Working
function getTeamAverage(team) {
  let dataArrTest = [[], []];
  let teamData = getTeamNumData(team);
  let newTeamData = [];
  // console.log(teamData);
  for (let j = 0; j < teamData.length; j++) {
    newTeamData.push([]);
    for (let i = 0; i < teamData[j].length; i++) {
      if (teamData[0][i] != "Match Number") {
        newTeamData[j].push(teamData[j][i]);
      }
    }
  }
  dataArrTest[0].push(...newTeamData[0]);
  dataArrTest[1].push(...newTeamData[1]);


  // console.log(numTeamMap);
  for (let i = 2; i < newTeamData.length; i++) {
    for (let j = 0; j < newTeamData[0].length; j++) {
      dataArrTest[1][j] =
        parseFloat(newTeamData[i][j]) + parseFloat(dataArrTest[1][j]);
      // console.log(dataArrTest[1]);
    }
  }


  // not a bug
  for (let i = 0; i < dataArrTest[1].length; i++) {
    dataArrTest[1][i] /= newTeamData.length - 1;
  }
  // console.log(dataArrTest);
  return dataArrTest;
}

// Working:
function getTeamAverageMap() {
  let averageMap = new Map();
  let teams = [];
  // console.log(numTeamMap);
  numTeamMap.forEach((value, key) => {
    teams.push(key);
  });
  for (let i = 0; i < teams.length; i++) {
    // console.log(getTeamAverage(teams[i]));
    averageMap.set(teams[i], getTeamAverage(teams[i]));
  }
  // console.log(averageMap);
  return averageMap;
}