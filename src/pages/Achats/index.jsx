import React from 'react'
import { Card, Grid, Tabs } from '@mantine/core'
import { BsCashCoin, BsTags, BsCart4 } from 'react-icons/bs'
import './achats.scss'
import Purchase from './achats'
import Commandes from './commandes'

function Achats() { 
    return (
        <div style={{padding: '8px 14px 8px 28px'}}>
            <Grid gutter='sm' style={{marginBottom:7}}>
                <div className='headerMainPage'>
                    <p style={{display: 'inline-flex', alignItems: 'center', fontSize:18, fontWeight:'bold'}}><BsCashCoin size={20} style={{marginRight:8}} /> Approvisionnements</p>
                    <span className='rightSection'>
                    </span>
                </div>
            </Grid>
            <Grid gutter='sm' style={{marginBottom:7}}>
                <Grid.Col span={12}>
                    <Card>
                        <Tabs defaultValue="purchase" variant="outline" tabPadding="md" orientation="horizontal" >
                            <Tabs.List>
                                <Tabs.Tab value="purchase" icon={<BsTags size={16} />}>Achats</Tabs.Tab>
                                <Tabs.Tab value="commande" icon={<BsCart4 size={16} />}>Commandes</Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="purchase">
                                <Purchase />
                            </Tabs.Panel>

                            <Tabs.Panel value="commande">
                                <Commandes />
                            </Tabs.Panel>
                        </Tabs>
                    </Card>
                </Grid.Col>
            </Grid>
    </div>
    )
}

export default Achats