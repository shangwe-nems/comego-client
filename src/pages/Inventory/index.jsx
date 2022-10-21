import React, { useEffect, useState } from 'react'
import { Button, Card, Grid, Modal, Title, ScrollArea, TextInput, Table, createStyles, UnstyledButton, Center, Group, Text, Divider, Avatar } from '@mantine/core'
import { BsSearch, BsFillJournalBookmarkFill, BsChevronUp, BsChevronDown, BsChevronExpand, BsTags, BsPlusLg } from 'react-icons/bs'
import './inventory.scss'
import PVForm from '../../components/PVForm'
import Loading from '../../components/Loader'
import { LoadStocks } from '../../hooks/fetchStocks'
import { useSelector } from 'react-redux'
import ServiceForm from '../../components/ServiceForm'

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
    const keys = ['designation'];
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

function Inventory() {
    const stocksState = useSelector(state => state.stocks)
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [serviceVisible, setserviceVisible] = useState(false)

    const [isLoading, stocks] = LoadStocks()

    
    const [selectedStock, setselectedStock] = useState()
    const [createVisible, setcreateVisible] = useState(false)

    useEffect(() => { 
        setSortedData(stocksState)
        return () => {
            setSortedData([])
        }
    }, [stocksState, stocks])
    
    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(stocks, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const parseNumber = (value) => {
        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Here is where we design the data in the rows data
    const rows = sortedData?.slice(0).reverse().map((row) => (
        <tr key={row._id} style={{cursor: "pointer"}}>
            {/* Avatar */}
            <td>
                <Avatar size='sm'><BsTags size={16} color='red' /></Avatar>
            </td>
            {/* Designation */}
            <td>
                <h3 style={{margin: 0, padding: 0, fontWeight:400, fontSize:14, marginBottom: -4}}>{row?.designation}</h3>
                <p style={{fontSize:12, color: 'red'}}>{row?.category === 'product' ? 'Produit' : 'Service'}</p>
            </td>
            {/* PV Min */}
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, color: 'green', fontSize:16}}>{`$${row?.pv_min?.toFixed(2)}`}</h3>
            </td>
            {/* Qty */}
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:400, fontSize:16, color: row.category === 'service' ? 'dodgerblue' : row.qty > row.qty_min ? null : 'red'}}>{parseNumber(row.qty)} {row.unit}</h3>
            </td>
            {/* Prix de revient */}
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, color:'dodgerblue', fontSize:16}}>${row?.revient_price.toFixed(2)}</h3>
            </td>
            {/* Prix de vente Min */}
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, color: 'GrayText', fontSize:16}}>{row?.pv_medium ? `$${row?.pv_medium.toFixed(3)}` : 'n/a'}</h3>
            </td>
            {/* Prix de vente Gen */}
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontWeight:600, color: 'GrayText', fontSize:16}}>{row?.pv_gen ? `$${row?.pv_gen.toFixed(3)}` : 'n/a'}</h3>
            </td>
            <td>
                <Button color="green" size='xs' variant="light" onClick={() => { setcreateVisible(true); setselectedStock(row)}}>Modifier prix</Button>
            </td>
        </tr>
    ));
    
    return (
        <div style={{padding: '8px 14px 8px 28px'}}>
            <Grid gutter='sm' style={{marginBottom:7}}>
                <div className='headerMainPage'>
                    <p style={{display: 'inline-flex', alignItems: 'center', fontSize:18, fontWeight:'bold'}}><BsFillJournalBookmarkFill fontSize={20} style={{marginRight:8}} /> Entrée en stock</p>
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
                                    <Button color="red" leftIcon={<BsPlusLg />} onClick={() => setserviceVisible(true)}>Ajouter service</Button>
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
                                        <col span="1" style={{width: "2.8%"}} />
                                        <col span="1" style={{width: "18%"}} />
                                        <col span="1" style={{width: "8%"}} />
                                        <col span="1" style={{width: "8%"}} />
                                        <col span="1" style={{width: "8%"}} />
                                        <col span="1" style={{width: "8%"}} />
                                        <col span="1" style={{width: "8%"}} />
                                        <col span="1" style={{width: "7%"}} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <Th>
                                              -
                                            </Th>
                                            <Th>
                                                Désignation
                                            </Th>
                                            <Th>
                                                PV Min
                                            </Th>
                                            <Th>
                                                Quantité
                                            </Th>
                                            <Th>
                                                PR
                                            </Th>
                                            <Th>
                                                PV Moyen 
                                            </Th>
                                            <Th>
                                                PV Gen 
                                            </Th>
                                            <Th>
                                                Actions
                                            </Th>
                                        </tr>
                                    </thead>
                                    {isLoading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan={8} style={{height: 120}}>
                                                <Loading />
                                            </td>
                                        </tr>
                                    </tbody>) : (<tbody>
                                    {rows.length > 0 ? (
                                        rows
                                    ) : (
                                        <tr >
                                            <td colSpan={8}>
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
                <PVForm
                    status='edit' 
                    handleClose={() => {
                        setcreateVisible(false)
                        setselectedStock(undefined)
                    }} 
                    stock={selectedStock} 
                />
            </Modal>

            <Modal
                overlayOpacity={0.5}
                opened={serviceVisible}
                onClose={() => setserviceVisible(false)}
                title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#fa5252'}}><BsTags size={18} style={{marginRight:8}} /> Nouveau service</Title>}
            >
                <ServiceForm 
                    status='create' 
                    handleClose={() => {
                        setserviceVisible(false)
                    }} 
                />
            </Modal>
    </div>
    )
}

export default Inventory