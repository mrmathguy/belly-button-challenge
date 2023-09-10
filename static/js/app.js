//Getting the URL for the json file

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//the divs to be referenced later on

let dropdown_ID = document.getElementById("selDataset");
let demo_info = document.getElementById("sample-metadata");
let graphDiv = document.getElementById('bar');
let bubbleDiv = document.getElementById('bubble');
let gaugeDiv = document.getElementById('gauge');

//creating the dropdown menu for the sample ids
d3.json(url).then(function(data) {
    for (i =0; i<data.names.length; i++){
        let optn = data.names[i];
        let option = document.createElement("option");
        option.textContent = optn;
        option.value = optn;
        dropdown_ID.appendChild(option);
    }
});
//This is where the magic happens
function optionChanged(value){
    d3.json(url).then(function(data) {
        //selecting default wash frequency to zero
        let freq=0;
        //this gets the dropdown id selected by user and populates the Demographic div
        for (i =0; i<data.metadata.length; i++){
            if(data.metadata[i].id.toString()===(value)){
                let demo="";
                freq = data.metadata[i].wfreq;
            for(j =0; j<Object.keys(data.metadata[i]).length;j++){
                    demo = demo+Object.keys(data.metadata[i])[j]+ ": "+Object.values(data.metadata[i])[j]+"<br />";           
            }
            demo_info.style.fontSize="small";
            demo_info.innerHTML = demo;

            break;
            }
        }
        //this gets graphs the OTU bacteria based on population size
         for(i=0; i<data.samples.length; i++){

            if(data.samples[i].id===value){
                let otus_data = data.samples[i].otu_ids.slice(0,10);
                let otus_values = data.samples[i].sample_values.slice(0,10); 
                let trace1 = {
                    y:  otus_data.map((object)=>"OTU "+object),
                    x: otus_values,
                    type: 'bar',
                    orientation: 'h',
                    transforms: [{
                        type: 'sort',
                        target: 'x',
                        order: 'ascending'
                      }]
                   };
                let graph_data = [trace1];

                Plotly.newPlot(graphDiv, graph_data);

            //bubble graph!!
                let trace2 = {
                    x: data.samples[i].otu_ids,
                    y:data.samples[i].sample_values,
                    mode: 'markers',
                    marker: {
                        color: data.samples[i].otu_ids,
                        size: data.samples[i].sample_values
                      }
                }
                let bubble_graph = [trace2];

                Plotly.newPlot(bubbleDiv, bubble_graph);
            //creates the needle in the gauge chart that visualizes the frequency of belly button washes per week 
                function needle(value){

                    //MATH DADDY TIME!!!!!
                    let degrees = 180-20*value;
                    let radius = 0.35;

                    let radians = degrees*Math.PI/180;
                    let x = radius*Math.cos(radians)+0.5;
                    let y = radius*Math.sin(radians)+0.5;


                
                var mainPath = 'M 0.5 0.5 L 0.47 0.5 L ',
                pathX = String(x),
                space = ' ',
                pathY = String(y),
                pathEnd = ' Z';
                var path = mainPath.concat(pathX,space,pathY,pathEnd);

                return path;

                }
                //creates the 'gauge' which is basically half a pie chart with a hole in it
                let trace3 = [
                    {
                    domain: { x: [0, 1], y: [0, 1] },
                      type: "pie",
                      values: [5.56, 5.56, 5.56, 5.56, 5.56, 5.56, 5.56, 5.56, 5.56, 49.96],
                      rotation:90,
                      marker: {colors:['rgba(0, 128, 0, 0.5)', 'rgba(0, 177, 0, .5)',
						 'rgba(0, 187, 0, .5)','rgba(0, 198, 0, .5)','rgba(170, 262, 42, .5)',
						 'rgba(170, 202, 42, .5)', 'rgba(210, 206, 145, .5)',
						 'rgba(232, 226, 202, .5)','rgba(230, 230, 230, 0.5)',
                         'rgba(0,0,0,0)','rgba(0,0,0,0)']},
                         hole: .5,
                    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2','0-1'],
                    textinfo: 'text',
                    hoverinfo:'text',
                    showlegend: false,
                    title: "Belly Button Washing Frequency"
                    }
                  ];
                  //manifesting the needle
                  var layout = {
                    shapes:[{
                        type: 'path',
                       path: needle(freq),
                        fillcolor: '850000',
                        line: {
                          color: '850000'
                        }
                      },
                     ],
                      autosize:true
                
                    
                  };
                  
                  
                  Plotly.newPlot(gaugeDiv, trace3, layout);

                 break;
            }
        }
           
       
        
            
        
});

  


}
