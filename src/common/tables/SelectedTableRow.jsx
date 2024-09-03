import React from "react";

const SelectedTableRow = ({
    data=[],
    columns = [],
    onSelectedRowsChange = function(){},
    customStyles=null,
    loader=null,
    noDataComponent,
    progressComponent,
}) => {
    return <>
        <DataTable
            columns={columns}
            data={data ? data: []}
            noHeader
            selectableRows
            // fixedHeader
            onSelectedRowsChange={onSelectedRowsChange}
            customStyles={customStyles}
            progressPending={loader}
            // onRowClicked={rowClickHandler}
            responsive={true}
            noDataComponent={noDataComponent}
            progressComponent={progressComponent}
        />
    </>
}

export default SelectedTableRow;