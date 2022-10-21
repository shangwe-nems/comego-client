import { Avatar, Card, Grid } from '@mantine/core'
import React from 'react'
import { BsColumnsGap, BsFillPeopleFill, BsSquareFill, BsTags } from 'react-icons/bs'
import { MdAddTask } from 'react-icons/md'
import { AiOutlineMoneyCollect } from 'react-icons/ai'
import DashboardAreaChart from './AreaChart'
import DashboardBarChart from './BarChart'
import './dashboard.scss'
import DashboardPieChart from './PieChart'
import { LoadDashboardData } from '../../hooks/fetchDashboard'
import Loading from '../../components/Loader'

function Dashboard() {
    const [isLoading, data] = LoadDashboardData();

    const parseNumber = (value) => {
        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // function kFormatter(num) {
    //     return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
    // }
    

  return (
    <div style={{padding: '8px 14px 8px 28px'}}>
        <Grid gutter='sm' style={{marginBottom:7}}>
            <div className='headerMainPage'>
                <p style={{display: 'inline-flex', alignItems: 'center', fontSize:18, fontWeight:'bold'}}><BsColumnsGap fontSize={20} style={{marginRight:8}} /> Acceuil</p>
                <span className='rightSection'>
                </span> 
            </div>
        </Grid>
        
        <Grid gutter='sm' style={{marginBottom:7}}>
            <Grid.Col span={9}>
                <Grid gutter={14}>
                    <Grid.Col span={4}>
                        <Card >
                            <div className='cardSpecs'>
                                <Avatar color="red" size={48} radius="xl">
                                    <MdAddTask size={24} />
                                </Avatar>
                                <div className='rightSectionSpecs'>
                                    <p>Dettes fournisseurs</p>
                                    {isLoading ? <Loading /> : 
                                        <h3>${parseNumber(data?.tot_debt_provider?.toFixed(2))}</h3>
                                    }
                                    {/* <span>
                                        <BsArrowDown size={12} color="red" />
                                        <p>
                                            <b>4 fournisseurs </b>
                                            en attente de remboursement
                                        </p>
                                    </span> */}
                                </div>
                            </div>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Card>
                            <div className='cardSpecs'>
                                <Avatar color="blue" size={48} radius="xl">
                                    <AiOutlineMoneyCollect size={24} />
                                </Avatar>
                                <div className='rightSectionSpecs'>
                                    <p>Créances</p>
                                    {isLoading ? <Loading /> : 
                                        <h3>${parseNumber(data?.tot_debt_client?.toFixed(2))}</h3>
                                    }
                                    {/* <span> 
                                        <BsArrowUp color='red' />
                                        <p>
                                            hausse de 
                                            <b> 16%</b>
                                        </p>
                                    </span> */}
                                </div>
                            </div>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Card >
                            <div className='cardSpecs'>
                                <Avatar color="orange" size={48} radius="xl">
                                    <BsFillPeopleFill size={24} />
                                </Avatar>
                                <div className='rightSectionSpecs'>
                                    <p>Solde Caisse</p>
                                    {isLoading ? <Loading /> : 
                                        <h3>${parseNumber(data?.solde?.toFixed(2))}</h3> 
                                    }
                                    {/* <span>
                                        <BsArrowUp color='green' />
                                        <p>
                                            <b>$130.00 </b> comme dernière transaction
                                            
                                            
                                        </p>
                                    </span> */}
                                </div>
                            </div>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Card className='cardStyle' style={{position: 'relative'}}>
                            <h3 className='cardTitle'>Activités (542)</h3>
                            <div style={{width: "100%", height:408}}>
                                {isLoading ? <Loading /> : 
                                    <DashboardAreaChart data={data?.activities} />
                                }
                            </div>
                            <p style={{position: "absolute", top: 65, right: 45, fontSize: 16, color:"#a6a6a6"}}>{new Date().getFullYear()}</p>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Grid.Col>
            <Grid.Col span={3}>
                <Card className='topDivision' >
                    <h3 className='cardTitle'>Best sales</h3>

                    {data?.best_selling_products?.map(product => (
                        <div className='divisionCard' key={product._id}>
                            <Avatar color="red" size={46} radius="xl">
                                <BsTags size={28} />
                            </Avatar>
                            <span>
                                <h4>{product.designation}</h4>
                                <p>{((product.count/data?.sum_sales_products)*100).toFixed(2)}%</p>
                            </span>
                    </div>
                    ))}
                </Card>
            </Grid.Col>
        </Grid>

        <Grid gutter='sm' style={{marginBottom:7}}>
            <Grid.Col span={6}>
                <Card>
                    <h3 className='cardTitle'>Meilleurs Clients</h3>
                    <div style={{width: "100%", height:250}}>
                    {isLoading ? <Loading /> : 
                        <DashboardBarChart data={data?.best_clients} dataKey="count" />
                    }
                    </div>
                    <p style={{position: "absolute", top: 22, right: 45, fontSize: 16, color:"#a6a6a6"}}>{new Date().getFullYear()}</p>
                </Card>
            </Grid.Col>
            <Grid.Col span={6}>
                <Card>
                    <h3 className='cardTitle'>Ventes</h3>
                    {isLoading ? <Loading /> : 
                        <div style={{width: "100%", height:250}} className='piechart_gender'>
                            <div className='chart'>
                                <DashboardPieChart data={[
                                    { name: "Cash", value: data?.cash_tot_payment, color: "#fa5252" },
                                    { name: "Crédit", value: data?.credit_tot_payment,  color: "#cacaca" }
                                ]} />
                            </div>
                            <div className='center_data'>
                                <h4>${parseNumber((data?.cash_tot_payment + data?.credit_tot_payment)?.toFixed(2))}</h4>
                                <p>comme chiffre d'affaire</p>
                            </div>
                            <div className='right_data'>
                                <div className='men_data'>
                                    <span><BsSquareFill color='#fa5252' size={14} style={{marginRight:8}} /> Paiement cash</span>
                                    <p><b>{((parseFloat(data?.cash_tot_payment) / parseFloat(data?.cash_tot_payment + data?.credit_tot_payment)) * 100).toFixed(2)}%</b> (${parseNumber(data?.cash_tot_payment?.toFixed(2))})</p>
                                </div>
                                <div className='women_data'>
                                    <span><BsSquareFill color='#cacaca' size={14} style={{marginRight:8}} /> Paiement credit</span>
                                    <p><b>{((parseFloat(data?.credit_tot_payment) / parseFloat(data?.cash_tot_payment + data?.credit_tot_payment)) * 100).toFixed(2)}%</b> (${parseNumber(data?.credit_tot_payment?.toFixed(2))})</p>
                                </div>
                            </div>
                        </div>
                    }
                    <p style={{position: "absolute", top: 22, right: 45, fontSize: 16, color:"#a6a6a6"}}>{new Date().getFullYear()}</p>
                </Card>
            </Grid.Col>
        </Grid>
    </div>
  )
}

export default Dashboard