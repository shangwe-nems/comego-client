import React, { useRef, useState } from 'react'
import { ActionIcon, Avatar, Button, Card, createStyles, Divider, Grid, Group, ScrollArea, Table, Text, TextInput, UnstyledButton } from '@mantine/core'
import { BsArrowBarLeft, BsArrowRight, BsBoxArrowInRight, BsCash, BsExclamationOctagon, BsFileEarmark, BsFilePdf, BsSearch } from 'react-icons/bs'
import './reports.scss'
import { DateRangePicker } from '@mantine/dates'
import { useDispatch } from 'react-redux'
import Loading from '../../components/Loader'
import { useForm } from '@mantine/form'
import { useNotifications } from '@mantine/notifications'
import { findResults } from '../../redux/slices/results'
import ReactToPrint from 'react-to-print'

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
  }
}));

function Th({ children, reversed, sorted, onSort }) {
  const { classes } = useStyles();

  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        {children === '-' ? null : 
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
        </Group>
        }
      </UnstyledButton>
    </th>
  );
}


function filterData(data, search) {
  const keys = ['code', 'designation'];
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

const parseNumber = (value) => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function Reports() {
  const dispatch = useDispatch();
  const notifications = useNotifications()
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [isLoading, setIsLoading] = useState(false)
  const [selectedData, setselectedData] = useState()
  const [queriedData, setQueriedData] = useState([])

  const form = useForm({
      date_range: (value) => (value.length === 0 ? 'La date ne peut etre vide' : null)
  })


  const componentRef = useRef();

  function adjust(date) {
      const myDate = new Date(date);
      myDate.setDate(myDate.getDate() + parseInt(1));
      return myDate.toISOString()
  }

  function handleSubmit() {
    setIsLoading(true);
    const range = form.values?.date_range

    if(!range) {
        setIsLoading(false)
        notifications.showNotification({
            color: 'orange',
            title: 'Attention',
            message: 'La date ne peut etre vide!!',
            icon: <BsExclamationOctagon />
        })
    } else {
        const start_date = range[0]?.toISOString()
        const end_date = adjust(range[1])

        setselectedData({ start_date: range[0], end_date : range[1]})

        const clientsFetch = async function(){
            const res = await dispatch(findResults({ start_date, end_date }))
            if(res?.payload) {
                setSortedData(res?.payload)
                setQueriedData(res?.payload)
            } else {
                setSortedData([])
            }
            setIsLoading(false);
        }

        clientsFetch()
    } 
  }

  const rows = sortedData?.map((row) => (
      <tr key={row.designation_id} style={{cursor: 'pointer'}}>
        {/* Avatar */}
        <td >
            <Avatar size='sm'><BsCash size={16} color='red' /></Avatar>
        </td>
        {/* Designation */}
        <td style={{textAlign: 'right'}}>
            <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:16}}>{row?.code}</h3>
        </td>
        {/* PV Min */}
        <td style={{textAlign: 'left'}}>
            <h3 style={{margin: 0, padding: 0, fontWeight:400, color: 'green', fontSize:16}}>{row?.designation}</h3>
        </td>
        {/* Prix de revient */}
        <td style={{textAlign: 'center'}}>
            <h3 style={{margin: 0, padding: 0, fontWeight:600, color:'dodgerblue', fontSize:16}}>{row?.move === 'in' ? <BsBoxArrowInRight size={22} /> : null}</h3>
        </td>
        {/* Prix de vente Min */}
        <td style={{textAlign: 'center'}}>
            <h3 style={{margin: 0, padding: 0, fontWeight:600, color: 'red', fontSize:16}}>{row?.move === 'out' ? <BsArrowBarLeft size={22} /> : null}</h3>
        </td>
        {/* Qty */}
        <td style={{textAlign: 'right'}}>
            <h3 style={{margin: 0, padding: 0, fontWeight:600, fontSize:18, color: row.move === 'in' ? 'dodgerblue' : 'red'}}>${parseNumber(row?.total?.toFixed(2))}</h3>
        </td>
      </tr>
  ));

  const setSorting = (field) => {
      const reversed = field === sortBy ? !reverseSortDirection : false;
      setReverseSortDirection(reversed);
      setSortBy(field);
      setSortedData(sortData(queriedData, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
      const { value } = event.currentTarget;
      setSearch(value);
      setSortedData(sortData(queriedData, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  return (
    <div style={{padding: '8px 14px 8px 28px'}}>
       <Grid gutter='sm' style={{marginBottom:7}}>
            <div className='headerMainPage'>
                <p style={{display: 'inline-flex', alignItems: 'center', fontSize:18, fontWeight:'bold'}}><BsFileEarmark fontSize={20} style={{marginRight:8}} /> Resultats</p>
                <span className='rightSection'>
                      
                </span> 
            </div>
        </Grid>
        <Grid gutter='sm' style={{marginBottom:7}}>
          <Grid.Col span={12}>
            <Card>
              <Grid>
                <Grid.Col span={12}>
                  <form onSubmit={form.onSubmit(handleSubmit)}>
                      <div style={{width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent:'space-between', marginBottom:-24}}>
                          <TextInput
                              placeholder="Search by any field"
                              variant="filled" 
                              icon={<BsSearch size={14} />}
                              value={search}
                              onChange={handleSearchChange}
                              style={{width: 300}}
                          />
                          <div style={{display:'inline-flex', alignItems: 'center'}}>
                              <DateRangePicker 
                                  variant='filled' 
                                  required
                                  style={{width: 300, marginRight: 12}} 
                                  {...form.getInputProps('date_range')}
                                  rightSection={
                                      <ActionIcon type="submit" variant='filled' loading={isLoading}  color='red'>
                                          <BsArrowRight />
                                      </ActionIcon>} 
                              />           

                              <ReactToPrint
                                  trigger={() => <Button variant='filled' leftIcon={<BsFilePdf />}>Export to PDF</Button>}
                                  content={() => componentRef.current}
                              />                        
                          </div>
                      </div>
                  </form>
                </Grid.Col>
                <Grid.Col span={12}>
                  <ScrollArea style={{minHeight: 800}} ref={componentRef}>
                      {selectedData ? 
                        <Text weight={600} size='md' underline style={{textAlign: 'center'}} color='red'>
                            Résultats financiers du {new Date(selectedData?.start_date).toLocaleString().substring(0,10)} au {new Date(selectedData?.end_date).toLocaleString().substring(0,10)}
                        </Text> : null 
                      }    
                      <Divider style={{marginBlock:14}} />
                      <Table 
                          highlightOnHover
                          horizontalSpacing="md"
                          verticalSpacing="xs"
                          sx={{ tableLayout: 'fixed', minWidth: 700 }}
                      >
                          <colgroup>
                              <col span="1" style={{width: "3.8%"}} />
                              <col span="1" style={{width: "8%"}} />
                              <col span="1" style={{width: "28%"}} /> 
                              <col span="1" style={{width: "6%"}} />
                              <col span="1" style={{width: "6%"}} />
                              <col span="1" style={{width: "8%"}} />
                          </colgroup>
                          <thead>
                              <tr>
                                  <Th>
                                    -
                                  </Th>
                                  <Th
                                    sorted={sortBy === 'code'}
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting('code')}
                                  >
                                      Code
                                  </Th>
                                  <Th
                                    sorted={sortBy === 'designation'}
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting('designation')}
                                  >
                                      Designation
                                  </Th>
                                  <Th>
                                      Entrée
                                  </Th>
                                  <Th>
                                      Sortie
                                  </Th>
                                  <Th>
                                      Total
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
                </Grid.Col>
              </Grid>
            </Card>
          </Grid.Col>
        </Grid>
    </div>
  )
}

export default Reports