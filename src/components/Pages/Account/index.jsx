import {useParams} from "react-router-dom"
import {postData} from "../../../utils/api.js"
import {useEffect, useState} from "react"
import FloatingNumber from "./floating-number.jsx"
import EffectiveCommentVote from "./Operation/EffectiveCommentVote/index.jsx"
import Vote from "./Operation/Vote/index.jsx"
import ClaimRewardBalance from "./Operation/ClaimRewardBalance/index.jsx"
import CommentOptions from "./Operation/CommentOptions/index.jsx"
import CurationReward from "./Operation/CurationReward/index.jsx"
import Transfer from "./Operation/Transfer/index.jsx"
import ClaimAccount from "./Operation/ClaimAccount/index.jsx"
import Comment from "./Operation/Comment/index.jsx"
import CommentBenefactorReward from "./Operation/CommentBenefactorReward/index.jsx"
import AccountCreated from "./Operation/AccountCreated/index.jsx"
import CreateClaimedAccount from "./Operation/CreateClaimedAccount/index.jsx"
import CustomJson from "./Operation/CustomJson/index.jsx"
import AccountUpdate from "./Operation/AccountUpdate/index.jsx"
import PowerDetail from "./PowerDetail/index.jsx"
import ResourceCredits from "./ResourceCredits/index.jsx"
import AccountDetail from "./AccountDetail/index.jsx"
import JsonMetadata from "./JsonMetadata/index.jsx"
import KeyHistory from "./KeyHistory/index.jsx"
import Authorities from "./Authorities/index.jsx"
import VotesFor from "./VotesFor/index.jsx"
import CommentPayoutUpdate from "./Operation/CommentPayoutUpdate/index.jsx";
import CommentReward from "./Operation/CommentReward/index.jsx";
import AuthorReward from "./Operation/AuthorReward/index.jsx";

const AccountPage = () => {
  const {username} = useParams()
  const trimmedUsername = username.startsWith('@') ? username.slice(1) : username
  const [accountHistory, setAccountHistory] = useState([])
  const [account, setAccount] = useState({})
  const [rcAccount, setRcAccount] = useState([])
  const [getDynamicGlobalProperties, setGetDynamicGlobalProperties] = useState({})
  const [totalVestingShares, setTotalVestingShares] = useState('')
  const [totalVestingFundHive, setTotalVestingFundHive] = useState('')

  const handleGetAccountHistory = async () => {
    try {
      const dataToSend = {
        jsonrpc: '2.0',
        method: 'condenser_api.get_account_history',
        params: [trimmedUsername, -1, 100],
        id: 1,
      }
      return await postData(dataToSend)
    } catch (error) {
      console.error('Error in handleGetAccountHistory:', error)
      throw error // Re-throw the error to propagate it up
    }
  }

  const handleGetAccount = async () => {
    try {
      const dataToSend = {
        jsonrpc: '2.0',
        method: 'condenser_api.get_accounts',
        params: [[trimmedUsername]],
        id: 1,
      }
      return await postData(dataToSend)
    } catch (error) {
      console.error('Error in handleGetAccount:', error)
      throw error // Re-throw the error to propagate it up
    }
  }

  const handleFindRcAccount = async () => {
    try {
      const dataToSend = {
        jsonrpc: '2.0',
        method: 'rc_api.find_rc_accounts',
        params: {'accounts': [trimmedUsername]},
        id: 1,
      }
      return await postData(dataToSend)
    } catch (error) {
      console.error('Error in handleFindRcAccount:', error)
      throw error // Re-throw the error to propagate it up
    }
  }

  const handleGetDynamicGlobalProperties = async () => {
    try {
      const dataToSend = {
        jsonrpc: '2.0',
        method: 'condenser_api.get_dynamic_global_properties',
        params: [],
        id: 1,
      }
      return await postData(dataToSend)
    } catch (error) {
      console.error('Error in handleGetDynamicGlobalProperties:', error)
      throw error // Re-throw the error to propagate it up
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          accountHistoryResponse,
          accountResponse,
          findRcAccountResponse,
          getDynamicGlobalPropertiesResponse,
        ] = await Promise.all([
          handleGetAccountHistory(),
          handleGetAccount(),
          handleFindRcAccount(),
          handleGetDynamicGlobalProperties(),
        ])

        const sorted = accountHistoryResponse?.result.sort((a, b) => b[0] - a[0])

        setAccountHistory(sorted)
        setAccount(accountResponse?.result[0])
        setRcAccount(findRcAccountResponse?.result.rc_accounts ?? [])
        setGetDynamicGlobalProperties(getDynamicGlobalPropertiesResponse?.result)

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData() // Invoke the fetchData function

  }, [trimmedUsername])

  useEffect(() => {
    if (getDynamicGlobalProperties) {
      const { total_vesting_fund_hive, total_vesting_shares } = getDynamicGlobalProperties
      setTotalVestingShares(total_vesting_fund_hive)
      setTotalVestingFundHive(total_vesting_shares)
    }
  }, [getDynamicGlobalProperties])


  return (
    <div className="container">
      <FloatingNumber/>
      <h2>
        <span className="text-muted">@</span>
        {trimmedUsername}
      </h2>
      <hr/>
      <div className="row">
        <div className="col-md-4">
          <PowerDetail
            account={account}
            rcAccount={rcAccount}
            totalVestingFundHive={totalVestingFundHive}
            totalVestingShares={totalVestingShares}
            getDynamicGlobalProperties={getDynamicGlobalProperties}
          />
          <ResourceCredits/>
          <AccountDetail/>
          <JsonMetadata/>
          <KeyHistory/>
          <Authorities/>
          <VotesFor/>
        </div>

        <div className="col-md-8">
          {accountHistory && accountHistory.map((tx, index) => {

            const transaction = tx[1]
            const opType = transaction.op[0]

            console.log(opType, transaction.op[1])

            if (opType === 'effective_comment_vote') {
              return <EffectiveCommentVote transaction={transaction} key={index}/>
            }

            if (opType === 'comment_payout_update') {
              return <CommentPayoutUpdate transaction={transaction} key={index}/>
            }

            if (opType === 'comment_reward') {
              return <CommentReward transaction={transaction} key={index}/>
            }

            if (opType === 'author_reward') {
              return <AuthorReward transaction={transaction} getDynamicGlobalProperties={getDynamicGlobalProperties} key={index}/>
            }

            if (opType === 'custom_json') {
              return <CustomJson transaction={transaction} key={index}/>
            }

            if (opType === 'account_update') {
              return <AccountUpdate transaction={transaction} key={index}/>
            }

            if (opType === 'vote') {
              return <Vote transaction={transaction} key={index}/>
            }

            if (opType === 'claim_reward_balance') {
              return <ClaimRewardBalance transaction={transaction} getDynamicGlobalProperties={getDynamicGlobalProperties} key={index}/>
            }

            if (opType === 'comment_options') {
              return <CommentOptions transaction={transaction} key={index}/>
            }

            if (opType === 'curation_reward') {
              return <CurationReward transaction={transaction} getDynamicGlobalProperties={getDynamicGlobalProperties} key={index}/>
            }

            if (opType === 'transfer') {
              return <Transfer transaction={transaction} key={index}/>
            }

            if (opType === 'claim_account') {
              return <ClaimAccount transaction={transaction} key={index}/>
            }

            if (opType === 'comment') {
              return <Comment transaction={transaction} key={index}/>
            }

            if (opType === 'comment_benefactor_reward') {
              return <CommentBenefactorReward transaction={transaction} getDynamicGlobalProperties={getDynamicGlobalProperties} key={index}/>
            }

            if (opType === 'account_created') {
              return <AccountCreated transaction={transaction} key={index}/>
            }

            if (opType === 'create_claimed_account') {
              return <CreateClaimedAccount transaction={transaction} key={index}/>
            }

            return <p key={index}>{opType} | need to add this kind of component</p>
          })
          }
        </div>
      </div>
    </div>
  )
}

export default AccountPage
