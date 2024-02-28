import PropTypes from "prop-types"
import {timeAgo, vestToHive} from "../../../../../utils/helper.js"

const ClaimRewardBalance = ({transaction, getDynamicGlobalProperties}) => {

  const {
    op: [
      opType,
      {account, reward_hbd, reward_hive, reward_vests}
    ],
    block,
    trx_id,
    op_in_trx,
    timestamp,
    virtual_op,
    trx_in_block
  } = transaction

  const trimTrxId = trx_id.substring(0, 9)

  const formatVestToHive = (vest) => vestToHive(
    vest,
    getDynamicGlobalProperties?.total_vesting_shares,
    getDynamicGlobalProperties?.total_vesting_fund_hive
  ).toFixed(3)

  return <div className="op op-mini" id={trx_id}>
    <a
      className="tag tag-hash keychainify-checked"
      href={`/tx/${trx_id}`}>
      {trimTrxId}
    </a>

    <div className="action">
      <span className="account">{account}</span> claim reward: {formatVestToHive(reward_vests)} HP
    </div>

    <div className="foot">
      <a href={`/b/${transaction.block}#${trx_id}`} className="keychainify-checked">
        <time className="timeago2" dateTime={timestamp} title={timestamp}>{timeAgo(timestamp)}</time>
      </a>
    </div>
  </div>
}

ClaimRewardBalance.propTypes = {
  transaction: PropTypes.object.isRequired,
  getDynamicGlobalProperties: PropTypes.object.isRequired,
}

export default ClaimRewardBalance
