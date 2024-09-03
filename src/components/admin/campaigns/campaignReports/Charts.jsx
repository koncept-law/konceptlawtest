import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip, scales } from "chart.js"
import { useEffect, useState } from "react"
import { Bar, Doughnut, Pie } from "react-chartjs-2"

// import Chart from "react-apexcharts";
// import { useSelector } from "react-redux";

const Charts = ({ barDataArray }) => {
  barDataArray = (Array.isArray(barDataArray) ? (barDataArray.map((item)=>(item?.number))): []);
  
  return (
    <>
      <div className="flex flex-col border border-solid border-slate-300 h-fit md:w-3/5 w-full rounded-md my-2">
        {/* // bar chart  */}
        <h1 className="text-xl text-center my-4 text-purple-800 font-bold">Status Report</h1>
        <div className="p-2 border border-solid  border-gray-200">
          <BarChart barData={barDataArray} />
        </div>
      </div>
      <div className="flex flex-col border border-solid border-slate-300 m-3 h-fit md:w-2/5 w-full rounded-md p-3">
        {/* // Donut chart  */}
        <h1 className="text-xl text-center text-purple-800 my-4 font-bold">Overall Report</h1>
        <div className="p-2 border border-solid border-gray-200">
          <DonutChart barData={barDataArray} />
        </div>
      </div>

      {/* // campaigns graph */}
      {/* <div className="w-full"> */}
      {/* <ApexBarChart /> */}
      {/* </div> */}
      {/* // pie chart  */}
      {/* <PieChart /> */}
    </>
  )
}


export const DonutChart = ({ barData }) => {

  ChartJS.register(
    BarElement, CategoryScale, Legend, LinearScale, Tooltip, ArcElement
  );

  const data = {
    labels: ["Total", "Delivered", "Failed"],
    datasets: [
      {
        // label: 'Campaign',
        data: [barData[0], barData[2], barData[4]],
        backgroundColor: ["#006eff", "#169200", "#e31212"],
      },
    ],
    scales: {

    }
  }

  const options = {
    width: "100%",
    responsive: true,
    maintainAspectRatio: false,
    // height: "fit-content",
  }


  return (
    <div className="h-[250px] md:h-[370px]">
      <Doughnut
        data={data}
        options={options}
      >
      </Doughnut>
    </div>
  )
}


export const BarChart = ({ barData }) => {
  const [options, setOptions] = useState({});

  const updateOptions = () => {
    const isSmallScreen = window.innerWidth < 768;
    const fontSize = isSmallScreen ? 10 : 14;

    setOptions({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: isSmallScreen ? 'y' : 'x', // Rotate based on screen size
      plugins: {
        legend: {
          display: false // Hide legend
        },
        title: {
          display: true,
          text: 'Status Report',
          font: {
            size: isSmallScreen ? 16 : 20
          }
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        x: {
          title: {
            display: !isSmallScreen,
            text: 'Status',
            font: {
              size: isSmallScreen ? 12 : 16,
              weight: 'bold'
            },
            padding: { top: 10, left: 0, right: 0, bottom: 0 }
          },
          ticks: {
            font: {
              size: fontSize
            },
            padding: 10
          },
          grid: {
            display: false
          }
        },
        y: {
          title: {
            display: !isSmallScreen,
            text: 'Numbers',
            font: {
              size: isSmallScreen ? 12 : 16,
              weight: 'bold'
            },
            padding: { top: 0, left: 0, right: 0, bottom: 10 }
          },
          ticks: {
            font: {
              size: fontSize
            },
            padding: 10,
            stepSize: 2
          },
          grid: {
            display: true,
            color: 'rgba(75, 192, 192, 0.2)',
            lineWidth: 1,
            borderDash: [5, 5]
          }
        }
      }
    });
  };

  const data = {
    labels: ["Total", "Sent", "Delivered", "Invalid", "Failed"],
    datasets: [
      {
        label: 'Status Report',
        data: barData,
        backgroundColor: ["#006eff", "#51ff00", "#169200", "#d5a805", "#e31212"],
        maxBarThickness: 40,
        borderRadius: 2
      }
    ]
  };

  useEffect(() => {
    updateOptions();
    window.addEventListener('resize', updateOptions);

    return () => {
      window.removeEventListener('resize', updateOptions);
    };
  }, []);

  return (
    <div className="chart-container lg:h-fit h-[500px] w-[100%]">
      <Bar data={data} options={options} />
    </div>
  );
};


export default Charts;
