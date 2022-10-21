
import React, { useState } from 'react'
import { Card, Grid, Text, SegmentedControl } from '@mantine/core'
import { BsCashStack, BsBank2, BsSafe2Fill } from 'react-icons/bs'
import './finance.scss'
import Treasurydisplay from '../../components/TreasuryDisplay';
import BankingDisplay from '../../components/BankingDisplay';
import { LoadMotives } from '../../hooks/fetchMotive';

function Finances() {
  const [value, setValue] = useState('treasury'); 
  LoadMotives()

  return (
    <div style={{padding: '8px 14px 8px 28px'}}>
        <Grid gutter='xs' style={{marginBottom:7}}>
            <div className='headerMainPage'>
              <p style={{display: 'inline-flex', alignItems: 'center', fontSize:18, fontWeight:'bold'}}><BsCashStack fontSize={20} style={{marginRight:8}} /> Finances</p>
            </div>
            <Grid.Col span={12}>
              <Card>
                <SegmentedControl
                  value={value}
                  onChange={setValue}
                  fullWidth
                  size='md'
                  color='red'
                  transitionDuration={500}
                  transitionTimingFunction="linear"
                  data={[
                    { 
                      value: 'treasury', 
                      label: (
                        <div>
                          <BsSafe2Fill size={42} />
                          <Text size="xs">Caisse</Text>
                        </div>
                      )
                    }, { 
                      value: 'banking', 
                      label: (
                        <div>
                          <BsBank2 size={42} />
                          <Text size="xs">Banque</Text>
                        </div>
                      ) 
                    }
                  ]}
                />

                {value === 'treasury' ? 
                  (<div>
                    <Treasurydisplay />
                  </div>)
                  : 
                  (<div>
                    <BankingDisplay />
                  </div>)
                }
              </Card>
            </Grid.Col>
        </Grid>
    </div>
  )
}

export default Finances