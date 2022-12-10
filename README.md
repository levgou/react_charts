# React Frontend Challenge

### https://levgou.github.io/react_charts/

## Lev Gourevitch - [lev.gourevitch@gamil.com](lev.gourevitch@gamil.com)

## Setup:
* Tasks done: all including bonus
* Libraries used - 
  * `chart.js` - for the line chart
  * `gantt-task-react` - copied into the project and hacked to achieve the needed functionality
  * `gh-pages` - to deploy to github pages
* Remarks:
  1. I used the most basic design, and mostly stayed with out of the box  what was provided by the libraries
  2. I didnt cover edge cases, and made some assumption to reduce the scope of the assignment 

## Challenges:

### Gantt chart
The Gantt  had a very specific spec, which I couldnt achieve with any of the main stream libraries i have found,
so i chose to use the library which enabled most of the used cases, but the one of multiple tasks per actor.
To achieve the need functionality I changed the library directly to fit my needs, mostly in a non-generic 
and very use case specific way (to reduce scope). I think that in this method I was able to achieve the 
given task in a timely manner, and to build on top of other peoples work. 


### Line Graph:
The line graph had the specific use case of changing the time frame - which in contrary to the Gantt, 
I had to choose what to display. As the graph displays inventory I went with displaying the inventory 
at the end of the period. To achieve this I had to generate multiple data sets from the provided one, which 
hold the values in accordance to the required time frame.

