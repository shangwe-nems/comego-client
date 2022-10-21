import React, { useEffect, useState } from 'react'
import { Card, Grid, Modal, Title, ScrollArea, TextInput, Table, createStyles, UnstyledButton, Group, Text, Divider, Avatar } from '@mantine/core'
import { BsSearch, BsTags, BsGlobe2 } from 'react-icons/bs'
import Loading from '../../components/Loader'
import { LoadTravels } from '../../hooks/fetchTravels'
import { useSelector } from 'react-redux'
import TripForm from '../../components/TripForm'

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

function Th({ children, onSort }) {
    const { classes } = useStyles();
    return (
      <th className={classes.th}>
        {children === '-' ? null :
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="apart">
            <Text weight={600} size="sm">
              {children}
            </Text>
          
          </Group>
        </UnstyledButton>
        }
      </th>
    );
}

function filterData(data, search) {
    const keys = ['reference', 'city'];
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

function Travel() {
    const travelsState = useSelector(state => state.travels)
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [isLoading, travels] = LoadTravels()

    
    const [selectedTravel, setselectedTravel] = useState()
    const [createVisible, setcreateVisible] = useState(false)


    useEffect(() => { 
        setSortedData(travelsState)
        return () => {
            setSortedData([])
        }
    }, [travelsState, travels])

    
    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(travels, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const parseNumber = (value) => {
        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Here is where we design the data in the rows data
    const rows = sortedData?.slice(0).reverse().map((row) => (
        <tr key={row._id} style={{cursor: "pointer"}}>
            {/* Avatar */}
            <td>
                <Avatar size='sm'><BsGlobe2 size={16} color='red' /></Avatar>
            </td>
            {/* Departure */}
            <td>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:16}}>{new Date(row?.departure).toLocaleString('vh').substring(0, 10)}</h3>
            </td>
             {/* Arrival */}
             <td>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:16}}>{new Date(row?.arrival).toLocaleString('vh').substring(0, 10)}</h3>
            </td>
            {/* City */}
            <td style={{textAlign: 'left'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, color: 'red', fontSize:16}}>{row?.city}</h3>
            </td>
            {/* reference */}
            <td style={{textAlign: 'left'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:400, fontSize:16, color: 'dodgerblue'}}>{row.reference}</h3>
            </td>
            {/* Prix de revient */}
            <td style={{textAlign: 'right'}}>
                <p style={{margin: 0, padding: 0, fontWeight:600, color:'dodgerblue', fontSize:16}}>{row?.currency}</p>
            </td>
            {/* Prix de vente Min */}
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:16}}>{row?.exchange_rate}</h3>
            </td>
            {/* Prix de vente Gen */}
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:16}}>{`$${parseNumber(row?.total_fees.toFixed(2))}`}</h3>
            </td>
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:16}}>{`$${parseNumber(row?.purchase_global_fees.toFixed(2))}`}</h3>
            </td>
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:16}}>{`${parseNumber(row?.coefficient.toFixed(2))}`}</h3>
            </td>
            <td style={{textAlign: 'left'}}>
                <Avatar color='gray' size={28} radius='50%'>{row?.author?.first_name[0]}{row?.author?.last_name[0]}</Avatar>
            </td>
        </tr>
    ));
    
    return (
        <div style={{padding: '8px 14px 8px 28px'}}>
            <Grid gutter='sm' style={{marginBottom:7}}>
                <div className='headerMainPage'>
                    <p style={{display: 'inline-flex', alignItems: 'center', fontSize:18, fontWeight:'bold'}}><BsGlobe2 fontSize={20} style={{marginRight:8}} /> Voyages effectués</p>
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
                                    <Text color='dimmed' size='sm'>Liste des voyages effectué pour l'approvisionnement du stock.</Text>
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
                                        <col span="1" style={{width: "8%"}} />
                                        <col span="1" style={{width: "8%"}} />
                                        <col span="1" style={{width: "10%"}} />
                                        <col span="1" style={{width: "16%"}} />
                                        <col span="1" style={{width: "8%"}} />
                                        <col span="1" style={{width: "8%"}} />
                                        <col span="1" style={{width: "10%"}} />
                                        <col span="1" style={{width: "10%"}} />
                                        <col span="1" style={{width: "9%"}} />
                                        <col span="1" style={{width: "5%"}} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <Th>
                                              -
                                            </Th>
                                            <Th>
                                                Départ
                                            </Th>
                                            <Th>
                                                Arrivée
                                            </Th>
                                            <Th>
                                                Ville
                                            </Th>
                                            <Th>
                                                Reference
                                            </Th>
                                            <Th>
                                                Dévise 
                                            </Th>
                                            <Th>
                                                Taux
                                            </Th>
                                            <Th>
                                                Tot. frais
                                            </Th>
                                            <Th>
                                                Tot. achat 
                                            </Th>
                                            <Th>
                                                Coefficient
                                            </Th>
                                            <Th>
                                                -
                                            </Th>
                                        </tr>
                                    </thead>
                                    {isLoading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan={10} style={{height: 120}}>
                                                <Loading />
                                            </td>
                                        </tr>
                                    </tbody>) : (<tbody>
                                    {rows.length > 0 ? (
                                        rows
                                    ) : (
                                        <tr >
                                            <td colSpan={10}>
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
                title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#40c057'}}><BsTags size={18} style={{marginRight:8}} /> Prix de vente Moyen & Gen</Title>}
            >
                <TripForm
                    status='edit' 
                    handleClose={() => {
                        setcreateVisible(false)
                        setselectedTravel(undefined)
                    }} 
                    travel={selectedTravel} 
                />
            </Modal>
    </div>
    )
}

export default Travel