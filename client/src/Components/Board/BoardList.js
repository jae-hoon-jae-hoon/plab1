import './Board.css'

import React from 'react'
import SubVisual from '../SubVisual/SubVisual'

const BoardList = ({ title }) => {
    return (
        <>
            <SubVisual pageTitle={title} />

            <div className='container login'>
                <div className='inner'>
                    <div className='container__content'>
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col" style={{width:"40px"}}>No</th>
                                    <th scope="col" style={{width:"auto"}}>제목</th>
                                    <th scope="col" style={{width:"200px"}}>작성자</th>
                                    <th scope="col" style={{width:"200px"}}>작성일</th>
                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td colspan="2">Larry the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BoardList