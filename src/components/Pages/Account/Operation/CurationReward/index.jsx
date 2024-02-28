import PropTypes from "prop-types"
import {timeAgo, vestToHive} from "../../../../../utils/helper.js"

const CurationReward = ({transaction, getDynamicGlobalProperties}) => {

  const {
    op: [
      opType,
      {author, curator, payout_must_be_claimed, permlink, reward}
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

    <span className="tag tag-virt">virtual</span>

    <div className="action">
      <span className="account">{curator}</span> curation reward: {formatVestToHive(reward)} HP {`for `}
      <a
        href={`/@${author}/${permlink}`}
        className="keychainify-checked"
      >
        {`@${author}/${permlink}`}
      </a>
    </div>

    <div className="foot">
      <a href={`/b/${transaction.block}#${trx_id}`} className="keychainify-checked">
        <time className="timeago2" dateTime={timestamp} title={timestamp}>{timeAgo(timestamp)}</time>
      </a>
    </div>
  </div>
}

CurationReward.propTypes = {
  transaction: PropTypes.object.isRequired,
  getDynamicGlobalProperties: PropTypes.object.isRequired,
}

export default CurationReward
