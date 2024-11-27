// MUI imports
import { IconButton, Tooltip } from '@mui/material'

// MUI X-Data-Grid imports
import { ptBR } from '@mui/x-data-grid/locales/ptBR'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

const RenderActionsButton = ({
  params,
  handleDeleteAddress
}: {
  params: GridRenderCellParams<any, string>
  handleDeleteAddress: (value: string) => void
}) => {
  return (
    <Tooltip title='Excluir'>
      <IconButton size='small' onClick={() => handleDeleteAddress(String(params.id))}>
        <i className='tabler-trash' />
      </IconButton>
    </Tooltip>
  )
}

const HistoryTable = ({
  historyRows,
  handleDeleteAddress,
  loading,
  page,
  pageSize
}: {
  historyRows: Array<any>,
  handleDeleteAddress: (id: string) => void,
  loading: boolean,
  page: number,
  pageSize: number
}) => {
  const columns: GridColDef[] = [
    { field: 'place_name', headerName: 'Endereço', flex: 1 },
    { field: 'center', headerName: 'Coordenadas', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <RenderActionsButton params={params} handleDeleteAddress={handleDeleteAddress} />
      )
    }
  ]
  const { localeText } = ptBR.components.MuiDataGrid.defaultProps

  return (
    <DataGrid
      loading={loading}
      localeText={localeText}
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '300px',
        '& .MuiDataGrid-virtualScroller': {
          minHeight: '250px'
        }
      }}
      rows={historyRows}
      columns={columns}
      disableColumnMenu
      disableRowSelectionOnClick
      initialState={{
        pagination: {
          paginationModel: { page, pageSize }
        }
      }}
      pageSizeOptions={[5, 10]}
    />
  )
}

export default HistoryTable
