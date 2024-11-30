'use client'

import { Grid, Paper, Typography } from "@mui/material"
import HistoryTable from "./historyTable"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useLocalStorage } from "react-use"
import { User } from "@prisma/client"
import { useRouter } from "next/navigation"

const History = () => {
  const router = useRouter()

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [userData] = useLocalStorage<User>('userData')
  const userId = userData?.id

  const getAddresses = () => {
    userId && axios.get(`/api/history?userId=${userId}`)
      .then(res => {
        setRows(res.data)
        setLoading(false)
      })
  }

  const handleDeleteAddress = async (id: string) => {
    await toast.promise(
      axios.delete(`/api/history?id=${id}`),
      {
        pending: 'Excluindo endereço',
        success: {
          render() {
            getAddresses()
            return 'Endereço excluído com sucesso'
          }
        },
        error: 'Erro ao excluir endereço'
      }
    )
  }

  useEffect(() => {
    if (!userData) {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    getAddresses()
  }, [page, pageSize])

  return (
    <Paper className='p-3'>
      <Grid container rowSpacing={3}>
        <Grid item xl={12}>
          <Typography color='customColors.textPrimary' className='font-bold text-xl'>
            Histórico de pesquisa
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <HistoryTable
            historyRows={rows}
            loading={loading}
            handleDeleteAddress={handleDeleteAddress}
            page={page}
            pageSize={pageSize}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default History
