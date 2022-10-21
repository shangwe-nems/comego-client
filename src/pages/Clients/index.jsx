import React, { useEffect, useState } from 'react'
import { Button, Card, Grid, Modal, Title, ScrollArea, TextInput, Table, ActionIcon, createStyles, UnstyledButton, Center, Group, Text, Divider, Avatar } from '@mantine/core'
import { BsSearch, BsFillJournalBookmarkFill, BsChevronUp, BsChevronDown, BsChevronExpand, BsPersonBadge, BsPencilFill, BsCash } from 'react-icons/bs'
import './clients.scss'
import Loading from '../../components/Loader'
import { useSelector } from 'react-redux'
import { LoadClients } from '../../hooks/fetchClients'
import ClientForm from '../../components/ClientForm'
import TreasuryForm from '../../components/TreasuryForm'

const useStyles = createStyles((theme) => ({
    th: {
      padding: '0 !important',
    },
  
    control: {
      width: '100%',
      padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
  
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      },
    },
  
    icon: {
      width: 21,
      height: 21,
      borderRadius: 21,
    },
}));

function Th({ children, reversed, sorted, onSort }) {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? BsChevronUp : BsChevronDown) : BsChevronExpand;
    return (
      <th className={classes.th}>
        {children === '-' ? null :
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="apart">
            <Text weight={500} size="sm">
              {children}
            </Text>
            {children === '' || children === 'Prix de vente' || children === 'Quantité' || children === 'PR' || children === 'PV Min' || children === 'PV Gen' || children === 'Actions' ? null :
            <Center className={classes.icon}>
              <Icon size={14} /> 
            </Center>}
          </Group>
        </UnstyledButton>
        }
      </th>
    );
}

function filterData(data, search) {
    const keys = ['reference', 'names'];
    const query = search.toLowerCase().trim();
    return data.filter((item) => keys.some((key) => item[key].toLowerCase().includes(query)));
}

function sortData(data, payload) {
    if (!payload.sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
        [...data].sort((a, b) => {
        if (payload.reversed) {
            return b[payload.sortBy].localeCompare(a[payload.sortBy]);
        }

        return a[payload.sortBy].localeCompare(b[payload.sortBy]);
        }),
        payload.search
    );
}

function Client() {
    const clientsState = useSelector(state => state.clients)
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [isLoading, clients] = LoadClients()

    
    const [selectedStock, setselectedStock] = useState()
    const [createVisible, setcreateVisible] = useState(false)
    const [payVisible, setpayVisible] = useState(false)


    useEffect(() => { 
        setSortedData(clientsState)
        return () => {
            setSortedData([])
        }
    }, [clientsState, clients])
    
    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(clients, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const parseNumber = (value) => {
        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Here is where we design the data in the rows data
    const rows = sortedData?.slice(0).reverse().map((row) => (
        <tr key={row._id} style={{cursor: "pointer"}}>
            {/* Avatar */}
            <td>
                <Avatar size='sm'><BsPersonBadge size={16} color='red' /></Avatar>
            </td>
            {/* Designation */}
            <td>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:14}}>{row?.names}</h3>
            </td>

            {/* Designation */}
            <td>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:14}}>{row?.phone}</h3>
            </td>

            {/* Designation */}
            <td>
                <h3 style={{margin: 0, padding: 0, width:'100%', fontWeight:600, fontSize:14, textOverflow:'ellipsis'}}>{row?.email}</h3>
            </td>

            {/* Designation */}
            <td>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:14}}>{row?.reference}</h3>
            </td>

            {/* Creance */}
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, color: row?.dette === 0 ? 'GrayText' : 'red', fontSize:18}}>${parseNumber(row?.dette?.toFixed(2))}</h3>
            </td>
            
            <td>
                <div style={{width: '100%', display: 'inline-flex'}}>
                    <Avatar color='gray' size={28} style={{marginRight:8}} radius='50%'>{row?.author?.first_name[0]}{row?.author?.last_name[0]}</Avatar>
                    <ActionIcon color="green" variant="light" onClick={() => { setcreateVisible(true); setselectedStock(row)}}><BsPencilFill /></ActionIcon>
                    {row?.dette === 0 ? null : <Button color="cyan" variant="light" size="xs" onClick={() => {setpayVisible(true); setselectedStock(row)} } style={{marginLeft: 14}} leftIcon={<BsCash />}>  Payer</Button>}
                </div>
            </td>
        </tr>
    ));
    
    return (
        <div style={{padding: '8px 14px 8px 28px'}}>
            <Grid gutter='sm' style={{marginBottom:7}}>
                <div className='headerMainPage'>
                    <p style={{display: 'inline-flex', alignItems: 'center', fontSize:18, fontWeight:'bold'}}><BsFillJournalBookmarkFill fontSize={20} style={{marginRight:8}} /> Tous nos clients</p>
                    <span className='rightSection'>
                    </span>
                </div>
            </Grid>
            <Grid gutter='sm' style={{marginBottom:7}}>
                <Grid.Col span={12}>
                    <Card>
                        <div>
                            <ScrollArea style={{minHeight: 800}}>
                                <div style={{width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Text color='dimmed' size='sm'>Vous pouvez modifier les informations d'un client</Text>
                                    <TextInput placeholder="Search by any field" value={search} onChange={handleSearchChange} variant="filled" style={{width: 280}} icon={<BsSearch size={14} />} />
                                </div>
                                <Divider style={{marginBlock:14}} />
                                
                                <Table 
                                    highlightOnHover
                                    horizontalSpacing="md"
                                    verticalSpacing="xs"
                                    sx={{ tableLayout: 'fixed', minWidth: 700 }}
                                >
                                    <colgroup>
                                        <col span="1" style={{width: "4%"}} />
                                        <col span="1" style={{width: "15%"}} />
                                        <col span="1" style={{width: "12%"}} />
                                        <col span="1" style={{width: "18%"}} />
                                        <col span="1" style={{width: "12%"}} />
                                        <col span="1" style={{width: "12%"}} />
                                        <col span="1" style={{width: "13%"}} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <Th>
                                              -
                                            </Th>
                                            <Th>
                                              Noms
                                            </Th>
                                            <Th>
                                              Télephone
                                            </Th>
                                            <Th>
                                              Email
                                            </Th>
                                            <Th>
                                              Réference
                                            </Th>
                                            <Th>
                                              Solde 
                                            </Th>
                                            <Th>
                                              Actions
                                            </Th>
                                        </tr>
                                    </thead>
                                    {isLoading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan={7} style={{height: 120}}>
                                                <Loading />
                                            </td>
                                        </tr>
                                    </tbody>) : (<tbody>
                                    {rows.length > 0 ? (
                                        rows
                                    ) : (
                                        <tr >
                                            <td colSpan={7}>
                                                <Text weight={500} align="center">
                                                    Nothing found
                                                </Text>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>)}
                                </Table>
                            </ScrollArea>
                        </div>
                    </Card>
                </Grid.Col>
            </Grid>

            <Modal
                overlayOpacity={0.5}
                opened={createVisible}
                onClose={() => setcreateVisible(false)}
                title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#40c057'}}><BsPencilFill size={18} style={{marginRight:8}} /> Modifier client</Title>}
            >
                <ClientForm
                    status='edit' 
                    handleClose={() => {
                        setcreateVisible(false)
                        setselectedStock(undefined)
                    }} 
                    data={selectedStock} 
                />
            </Modal>

            <Modal
                overlayOpacity={0.5}
                opened={payVisible}
                onClose={() => setpayVisible(false)}
                title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#40c057'}}><BsCash size={18} style={{marginRight:8}} /> Effectuer paiement</Title>}
            >
                <TreasuryForm
                    status='create' 
                    handleClose={() => {
                        setpayVisible(false)
                        setselectedStock(undefined)
                    }} 
                    data={selectedStock} 
                    client={selectedStock}
                />
            </Modal>
    </div>
    )
}

export default Client