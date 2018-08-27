import React, { Component } from 'react';

export default class Pagination extends Component {
    constructor(props) {
        super(props)
        this.state ={
            sizePerPage : '',
        }
        this.onSizePerPageList = this.onSizePerPageList.bind(this);
        this.getPageActions = this.getPageActions.bind(this);
        this.onPreviousPage = this.onPreviousPage.bind(this);
        this.onNextPage = this.onNextPage.bind(this);
    }

    onSizePerPageList (sizePerList){
        var pageSize =$(sizePerList.currentTarget).val()
        this.props.onRowsCountChange(pageSize)
    }

    getPageActions(event){
        var page = $(event.currentTarget).attr("data-pagenumber")
        if(page != this.props.currPageNumber){
            //console.log("Current page:",page)
            this.props.onPageChange(page)
        }

    }

    onPreviousPage(){
        if(this.props.currPageNumber != 1){
            this.props.onPageChange(this.props.currPageNumber - 1)
        }

    }
    onNextPage(){
        var {rowsPerPage, totalRows, currPageNumber} = this.props
        var totalPages = Math.ceil(totalRows / rowsPerPage);
        //console.log("Total pages:",totalPages)
        if(currPageNumber != totalPages){
            this.props.onPageChange(this.props.currPageNumber + 1)
        }

    }

    render() {
        var {rowsPerPage, totalRows, currPageNumber} = this.props
        var totalPages = Math.ceil(totalRows / rowsPerPage);
        var pageNumbers = []
        for(var i = 1;i<=totalPages;i++){
            pageNumbers.push(i);
        }
        return (
            <div className="math-eth-table-options">

                <select onChange={this.onSizePerPageList} className="dropdown">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>

                <nav aria-label="math-eth-table-pagination">
                    <ul className="pagination">
                        <li className="" onClick={this.onPreviousPage}><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>


                        {pageNumbers.map((page,index) =>
                            <li onClick={this.getPageActions} data-pagenumber={page} key={index} className={page == currPageNumber ? 'active' : ''}>

                                <a href="#">{page}</a>
                            </li>
                        )}

                        <li className="" onClick={this.onNextPage}><a href="#" aria-label="Previous"><span aria-hidden="true">&raquo;</span></a></li>
                    </ul>
                </nav>
            </div>
        )


    }
}

