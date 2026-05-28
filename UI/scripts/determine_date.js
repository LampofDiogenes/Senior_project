
// this gets inaccurate when looking past 2 years, but works pretty well within 1 year
// POTENTIAL BUG : might not account for leap years
function daysFromToday(days)
{
  let d = new Date();
  d.setDate(d.getDate() + Math.abs(days));

  const target = document.getElementById("date_target")
  target.innerHTML = d

  return d;
};