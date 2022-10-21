import React from 'react'
import { Card, Grid, Tabs } from '@mantine/core'
import { BsGear, BsInfoCircle, BsPeopleFill, BsShieldExclamation } from 'react-icons/bs'
import GenInfoSettings from '../../components/GenInfoSettings'
import UsersSettings from '../../components/UsersSettings'
import PermissionSettings from '../../components/PermissionSettings'
import './settings.scss'

function Settings() {
  return (
    <div style={{padding: '8px 14px 8px 28px'}}>
       <Grid gutter='sm' style={{marginBottom:7}}>
            <div className='headerMainPage'>
                <p style={{display: 'inline-flex', alignItems: 'center', fontSize:18, fontWeight:'bold'}}><BsGear fontSize={20} style={{marginRight:8}} /> Paramètres</p>
                <span className='rightSection'>  
                </span> 
            </div>
        </Grid>
        <Grid gutter='sm' style={{marginBottom:7}}>
          <Grid.Col span={12}>
            <Card>
                <Tabs defaultValue="account" variant="outline" tabPadding="md" orientation="horizontal" >
                  <Tabs.List>
                    <Tabs.Tab value="account" icon={<BsInfoCircle size={16} />}>Gestion du compte</Tabs.Tab>
                    <Tabs.Tab value="users" icon={<BsPeopleFill size={16} />}>Utilisateurs</Tabs.Tab>
                    <Tabs.Tab value="permissions" icon={<BsShieldExclamation size={16} />}>Permissions</Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="account" pt="xs">
                    <GenInfoSettings />
                  </Tabs.Panel>

                  <Tabs.Panel value="users" pt="xs">
                    <UsersSettings />
                  </Tabs.Panel>

                  <Tabs.Panel value="permissions" pt="xs">
                    <PermissionSettings />
                  </Tabs.Panel>
                </Tabs>
            </Card>
          </Grid.Col>
        </Grid>
    </div>
  )
}

export default Settings