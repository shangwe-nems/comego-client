import React, { useEffect, useState } from 'react'
import { Button, Card, Grid, Modal, Title, ScrollArea, TextInput, Table, createStyles, UnstyledButton, Center, Group, Text, Divider, Avatar } from '@mantine/core'
import { BsFolderPlus, BsCashCoin, BsSearch, BsPencilSquare, BsChevronUp, BsChevronDown, BsChevronExpand, BsTags, BsCart4 } from 'react-icons/bs'
import AchatForm from '../../components/AchatForm'
import './achats.scss'
import Loading from '../../components/Loader'
import { useSelector } from 'react-redux'
import { LoadPurchases } from '../../hooks/fetchPurchases'
import CommandeForm from '../../components/CommandeForm'

const useStyles = createStyles((theme) => ({
    th: {
      padding: '0 !important',
    },
  
    control: {
      width: '100%',
      padding: `8px ${theme.spacing.md}px`,
  
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      },
    },
  
    icon: {
      width: 16,
      height: 16,
      borderRadius: 8,
    },
}));

function Th({ children, reversed, sorted, onSort }) {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? BsChevronUp : BsChevronDown) : BsChevronExpand;
    return (
      <th className={classes.th}>
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group position="apart">
            <Text weight={400} size="sm">
              {children}
            </Text>
            {children === '-' ? null :
                <Center className={classes.icon}>
                {children === 'Désignation' || children === 'Date' ? <Icon size={14} /> : null }
                </Center>
            }
          </Group>
        </UnstyledButton>
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

function Purchase() {
    const purchasesState = useSelector(state => state.purchases)

    const [isLoading, purchases] = LoadPurchases();

    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [selectedPurchase, setselectedPurchase] = useState()

    useEffect(() => { 
        setSortedData(purchasesState)
        return () => {
            setSortedData([])
        }
    }, [purchasesState, purchases])

    const [createVisible, setcreateVisible] = useState(false)
    const [commandeVisible, setcommandeVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)

    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(purchases, { sortBy: field, reversed, search }));
    };
    
    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(purchases, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const parseNumber = (value) => {
        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  

    // Here is where we design the data in the rows data
    const rows = sortedData?.slice(0).reverse().map((row) => (
        <tr key={row?._id} style={{cursor: "pointer"}}>
            {/* Date */}
            <td>
                <div style={{display: 'inline-flex', alignItems: 'center', paddingLeft: 4}}>
                    <BsTags size={18} />
                    <div style={{marginLeft: 8, display: 'flex', flexDirection:'column', justifyContent:'center', alignItems: 'flex-start'}}>
                        <h3 style={{fontSize: 14 }}>{new Date(row?.createdAt).toLocaleString('vh').substring(0, 17)}</h3> 
                        <p style={{margin: 0, padding: 0, fontSize:14, color: 'GrayText', marginTop: -4}}>{row?.invoice_no ? `Fact Nº ${row?.invoice_no}` : `Fact Nº 0000000`}</p>
                    </div>
                </div>
            </td>
            {/* Designation & fournisseur */}
            <td>
                <h3 style={{margin: 0, padding: 0, fontSize:14, marginBottom: -4}}>{row?.designation}</h3>
                <p style={{textOverflow: 'ellipsis', color: 'GrayText', overflow: 'hidden', fontSize: 14}}>{row?.provider?.shop_name}</p>
            </td>
            {/* Achat */}
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontSize:16, marginBottom: -4}}>{`$${parseNumber(row?.local_pa_unit?.toFixed(3))}`}</h3>
                <p style={{textOverflow: 'ellipsis', color: 'GrayText', overflow: 'hidden', fontSize: 16}}>{`${row.qty} ${row.unit}`}</p>
            </td>
            {/* Monnaie Etrangere */}
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontSize:16, marginBottom: -4}}>{row?.foreign_pa_unit !== 0 ? `${row?.currency} ${parseNumber(row?.foreign_pa_unit)}` : 'n/a'}</h3>
                <p style={{textOverflow: 'ellipsis', color: 'GrayText', overflow: 'hidden', fontSize: 16}}>{row?.exchange_rate ? parseNumber(row?.exchange_rate) : 'n/a'}</p>
            </td>
            {/* Prix de revient & coeff */}
            <td style={{textAlign: 'right'}}>
                <h3 style={{margin: 0, padding: 0, fontSize:16, marginBottom: -4}}>${parseNumber(((row?.revient_price * 0.2) + row?.revient_price).toFixed(3))}</h3>
                <p style={{textOverflow: 'ellipsis', color: 'GrayText', overflow: 'hidden', fontSize: 16}}>${parseNumber(row?.revient_price.toFixed(3))}</p>
            </td>
            {/* Prix de vente */}
            <td style={{textAlign: 'left'}}>
                <Avatar color='gray' size={32} radius='50%'>{row?.author?.first_name[0]}{row?.author?.last_name[0]}</Avatar>
            </td>
        </tr>
    ));
    
    return (
        <div>
            <Grid gutter='sm' style={{marginBottom:7}}>
                <Grid.Col span={12}>
                    <Card>
                        <div>
                            <ScrollArea>
                                <div style={{width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <div>
                                        <Button leftIcon={<BsFolderPlus size={20} />} onClick={() => setcreateVisible(true)} color="red" style={{marginRight: 14}}>S'approvisionner</Button>
                                    </div>
                                    <div>
                                        <TextInput placeholder="Search by designation" style={{width: 280}} value={search} onChange={handleSearchChange} variant="filled" icon={<BsSearch size={14} />} />
                                    </div>
                                </div>
                                <Divider style={{marginBlock:14}} />
                                <Table 
                                    highlightOnHover
                                    horizontalSpacing="md"
                                    verticalSpacing="xs"
                                    sx={{ tableLayout: 'fixed', minWidth: 700 }}
                                >
                                    <colgroup>
                                        <col span="1" style={{width: "14%"}} />
                                        <col span="1" style={{width: "25%"}} />
                                        <col span="1" style={{width: "10%"}} />
                                        <col span="1" style={{width: "10%"}} />
                                        <col span="1" style={{width: "10%"}} />
                                        <col span="1" style={{width: "4%"}} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <Th
                                                sorted={sortBy === 'createdAt'}
                                                reversed={reverseSortDirection}
                                                onSort={() => setSorting('createdAt')}
                                            >
                                                Date
                                            </Th>
                                            <Th
                                                sorted={sortBy === 'designation'}
                                                reversed={reverseSortDirection}
                                                onSort={() => setSorting('designation')}
                                            >
                                                Désignation
                                            </Th>
                                            <Th>
                                                Achat & Qty
                                            </Th>
                                            <Th>
                                                PA en  M.E.
                                            </Th>
                                            <Th>
                                                PV min & PR
                                            </Th>
                                            <Th>
                                                -
                                            </Th>
                                        </tr>
                                    </thead>
                                    {isLoading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan={6} style={{height: 120}}>
                                                <Loading />
                                            </td>
                                        </tr>
                                    </tbody>) : (<tbody>
                                    {rows.length > 0 ? (
                                        rows
                                    ) : (
                                        <tr >
                                            <td colSpan={6}>
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
                title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#fa5252'}}><BsFolderPlus size={18} style={{marginRight:8}} /> Nouvel article</Title>}
            >
                <AchatForm
                    status='create' 
                    handleClose={() => {
                        setcreateVisible(false)
                        setselectedPurchase(undefined)
                    }} 
                />
            </Modal>


            <Modal
                overlayOpacity={0.5}
                opened={editVisible}
                onClose={() => setEditVisible(false)}
                title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#fa5252'}}><BsPencilSquare size={18} style={{marginRight:8}} /> Modifier article</Title>}
            >
                <AchatForm
                    status='edit' 
                    handleClose={() => {
                        setEditVisible(false)
                        setselectedPurchase(undefined)
                    }} 
                    purchase={selectedPurchase} 
                />
            </Modal>
    </div>
    )
}

export default Purchase