import React, { useEffect, useState } from "react";
import TreeGraph from "../widgets/TreeGraph";
import {fetchDataAndProcess} from '../Data.js'
import "./Tables.css";
import "./Rankings.css";

function Rankings() {
    const [data, setData] = useState([]);
    const [sortCol, setSortCol] = useState("Score");
    const [sortOrder, setSortOrder] = useState(1); // New state variable for sort order


    useEffect(() => {
        setTimeout(() => {
            fetchDataAndProcess().then((data) => {
                setData(data);
                sortByKey(data.rankingTable, sortCol);
            });
        }, 1000);
    }, []);

    useEffect(() => {
        if (data.rankingTable !== undefined && data.rankingTable !== null) {
            sortByKey(data.rankingTable, sortCol);
        }
    }, [sortOrder, sortCol]);

    // TODO: make working
    function sortByKey(arr, key) {
        return arr.sort((a, b) => {
            if (Number(a[key]) > Number(b[key])) return -1 * sortOrder;
            else if (Number(a[key]) < Number(b[key])) return 1 * sortOrder;
            else return 0;
        });
    }

    const handleSort = (header) => { // New function to handle sorting
        setSortCol(header);
        setSortOrder(sortOrder * -1); // Toggle the sort order
    };

    if (data.length === 0) {
        return <div>Loading...</div>;
    }

    const convertTreeMap = () => {
        let arr = [];
        for (let i = 0; i < data.rankingTable.length; i++) {
            arr.push({
                "name": data.rankingTable[i]["Team"],
                "children": [
                    {
                        "name": data.rankingTable[i]["Team"],
                        "Score": data.rankingTable[i]["Score"]
                    }
                ]
            });
        }
        console.log(arr);
        return arr;
    }

    let headers = Object.keys(data.rankingTable[0]);

    return (
        <div className="rankings-wrapper">
            <div className="container">
                <link
                    rel="stylesheet"
                    href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"
                ></link>
                <table className="table">
                    <thead className="header">
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} onClick={() => handleSort(header)}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.rankingTable.map((item, index) => (
                            <tr key={index}>
                                {headers.map((header, index) => (
                                    <td key={index}>
                                        {(isNaN(item[header])) ? item[header] : Math.round(item[header] * 100) / 100}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="tree-chart">
                <TreeGraph data={convertTreeMap()} dataKey={"Score"}/>
            </div>
        </div>
    );
}

export default Rankings;