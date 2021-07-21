import { combineReducers } from 'redux'
import AccountsReducer from './accounts'
import AssetsReducer from './assets'
import AuthReducer from './auth'
import BlogsReducer from './blogs'
import ChartReducer from './chart'
import ContstantsReducer from './constants'
import DocumentsReducer from './documents'
import GlobalsReducer from './globals'
import OrderReducer from './order'
import PostCodesReducer from './postcodes'
import QuoteReducer from './quote'
import VerificationReducer from './verification'
import { reducer as FormReducer } from 'redux-form'

const rootReducer = combineReducers({
	accounts: AccountsReducer,
	assets: AssetsReducer,
	auth: AuthReducer,
	blogs: BlogsReducer,
	chart: ChartReducer,
	constants: ContstantsReducer,
	documents: DocumentsReducer,
	globals: GlobalsReducer,
	order: OrderReducer,
	postcodes: PostCodesReducer,
	quote: QuoteReducer,
	verification: VerificationReducer,
	form: FormReducer
})

export default rootReducer
