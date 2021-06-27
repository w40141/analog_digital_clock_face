import document from "document";
import clock from "clock";
import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import * as util from "../common/utils";

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");

let monthDate = document.getElementById("monthDate");
let day = document.getElementById("day");

let time = document.getElementById("time");
let steps = document.getElementById("steps");
let hrm = document.getElementById("heart");
let btry = document.getElementById("battery")
let btryIcon = document.getElementById("batteryIcon")

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes, seconds) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  let secondAngle = (360/ 12 / 60 / 60) * seconds;
  return hourAngle + minAngle + secondAngle - 180;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes, seconds) {
  let minAngle = (360 / 60) * minutes;
  let secondAngle = (360/ 60 / 60) * seconds;
  return (minAngle + secondAngle) - 180;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

function setMonthDate(val) {
  monthDate.text = val;
}

//日付のテキストセット
function setDate(val) {
  return util.zeroPad(val);
}

function setMonth(val) {
  return util.zeroPad(val + 1);
}

//曜日のテキストセット
//getDayにより0~6で曜日を取得できるためそれぞれを文字に対応
function setDay(val) {
  switch(val){
    case 0:
      day.style.fill = "darkred";
      day.text = "SUN";
      break;
    case 1: 
      day.style.fill = "darkorange";
      day.text = "MON";
      break;
    case 2:
      day.style.fill = "darkred";
      day.text = "TUE";
      break;
    case 3:
      day.style.fill = "fb-cyan";
      day.text = "WED";
      break;
    case 4:
      day.style.fill = "fb-lime";
      day.text = "THU";
      break;
    case 5:
      day.style.fill = "gold";
      day.text = "FRI";
      break;
    case 6:
      day.style.fill = "fb-purple";
      day.text = "SAT";
      break;
  }
}

//バッテーリのテキストセット
function setBattery(){
  let val = Math.floor(battery.chargeLevel)
  let fill = ""
  if (val > 65) {
    fill = "fb-green";
  } else if (val > 30) {
    fill = "fb-yellow";
  } else {
    fill = "fb-red";
  }
  btryIcon.style.fill = fill;
  btry.style.fill = fill
  btry.text = util.spacePad(3, val) + "%";
}

//歩数のテキストセット
function setSteps(){
  steps.text = util.spacePad(5, today.local.steps)
}

//心拍数のテキストセット
function setHeartRate(){
  //心拍数
  var hr = new HeartRateSensor();
  hr.onreading = function() {
    hrm.text = hr.heartRate;
    //Stop monitoring the sensor
    hr.stop();
    }
  //Begin monitoring the sensor
  hr.start();
}

//時計の更新頻度を毎秒に設定
clock.granularity = "seconds";

// Rotate the hands every tick
function updateClock() {
  let d = new Date();
  let hours24 = d.getHours();
  let hours = hours24 % 12;
  let mins = d.getMinutes();
  let secs = d.getSeconds();

  // Set clock face
  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins, secs);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins, secs);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
  
  // Set always Info
  setMonthDate(setMonth(d.getMonth()) + "/" + setDate(d.getDate()));
  setDay(d.getDay());
  setBattery();
  
  // Set touch Info
  time.text = util.zeroPad(hours24) + ":" + util.zeroPad(mins) + ":" + util.zeroPad(secs);
  setSteps();
  setHeartRate();
}

// Update the clock every tick event
clock.addEventListener("tick", updateClock);