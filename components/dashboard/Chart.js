import React, { Component } from "react";
import { withRouter } from "next/router";
import { Line } from "react-chartjs-2";
import Moment from "react-moment";
import {
	fetchRates,
	fetchAssetsList,
	changeTimeInterval
} from "../../store/actions";
import { connect } from "react-redux";
import _ from "lodash";

class Chart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			coinName: "BTC",
			currentRate: 3800,
			latestRate: null,
			latestTimestamp: null,
			options: null,
			data: null,
			updatedOn: null,
			ShowCharts: props.assets.list.Receive[0].ShowCharts,
			ShowGlobal: props.assets.list.Receive[0].ShowGlobal,
			TDClass: (props.chart.intervalValue == "30D") ? "TD-interval chart-time-interval interval-selected" : "TD-interval chart-time-interval",
			SDClass: (props.chart.intervalValue == "7D") ? "SD-interval chart-time-interval interval-selected" : "TD-interval chart-time-interval",
			ODClass: (props.chart.intervalValue == "1D") ? "OD-interval chart-time-interval interval-selected" : "TD-interval chart-time-interval"
		};
		this.onScroll = this.onScroll.bind(this);
		this.updateTimeInterval = this.updateTimeInterval.bind(this);
	}

	componentDidMount() {
		this.props.fetchRates("GBPBTC");
		this.setState({
			updatedOn: new Date().getTime()
		});

		document
			.querySelector(".dashboard-page")
			.addEventListener("scroll", this.onScroll);
	}

	componentWillUnmount() {
		document
			.querySelector(".dashboard-page")
			.removeEventListener("scroll", this.onScroll);
	}

	onScroll() {
		const tooltip = document.querySelector("#chartjs-tooltip");
		if (tooltip) {
			// remove chart tooltip when unmounted
			if (tooltip.remove) {
				tooltip.remove();
			} else {
				tooltip.parentNode.removeChild(tooltip);
			}
		}
	}

	updateTimeInterval(val) {
		if (val == "30D") {
			this.setState({
				TDClass: "TD-interval chart-time-interval interval-selected",
				SDClass: "SD-interval chart-time-interval",
				ODClass: "OD-interval chart-time-interval"
			})
		} else if (val == "7D") {
			this.setState({
				TDClass: "TD-interval chart-time-interval",
				SDClass: "SD-interval chart-time-interval interval-selected",
				ODClass: "OD-interval chart-time-interval"
			})
		} else if (val == "1D") {
			this.setState({
				TDClass: "TD-interval chart-time-interval",
				SDClass: "SD-interval chart-time-interval",
				ODClass: "OD-interval chart-time-interval interval-selected"
			})
		}
		this.props.changeTimeInterval(val);
	}

	render() {
		return (
			<div className="chart-wrapper">
				{this.state.options &&
					(!this.state.ShowCharts || !this.state.ShowGlobal) ? (
						<div className="show-false-msg-dashboard">
							Chart data not available
          </div>
					) : (
						""
					)}
				{this.state.latestRate &&
					this.state.latestTimestamp &&
					this.state.ShowCharts &&
					this.state.ShowGlobal && (
						<div className="info-latest">
							<h6 className="rate">
								GBP/
                {this.state.coinName}
							</h6>
							<div className="check-click-outside">
								<div className="chart-time-interval-homepage">
									<span className={this.state.TDClass} onClick={() => this.updateTimeInterval("30D")}>&nbsp;30D&nbsp;</span>
									|
                  <span className={this.state.SDClass} onClick={() => this.updateTimeInterval("7D")}>&nbsp;7D&nbsp;</span>
									|
                  <span className={this.state.ODClass} onClick={() => this.updateTimeInterval("1D")}>&nbsp;1D&nbsp;</span>
								</div>
							</div>
							<span className="updated-at">
								{/* <Moment fromNow>{this.state.updatedOn}</Moment> */}
							</span>
						</div>
					)}
				{this.state.options ? (
					<div
						className={
							this.state.ShowCharts && this.state.ShowGlobal
								? "line"
								: "line blur-chart"
						}
					>
						<Line
							options={this.state.options}
							data={this.state.data}
							height={
								document && document.documentElement.clientWidth > 768
									? 230
									: 144
							}
						/>
					</div>
				) : (
						""
					)}
			</div>
		);
	}

	componentWillReceiveProps(props) {
		if (props.assets.currentAsset) {
			const coin = props.assets.list.Receive.find(
				coin => coin.Name === props.assets.currentAsset
			);
			if (coin && this.state.coinName !== coin.Name) {
				this.setState(
					{
						coinName: coin.Name,
						updatedOn: new Date().getTime(),
						ShowCharts: coin.ShowCharts,
						ShowGlobal: coin.ShowGlobal
					},
					() => this.props.fetchRates(`GBP${coin ? coin.Name : "BTC"}`)
				);
			}
		}
		if (props.chart && props.chart.data.ThirtyDay.length) {
			const coin = this.props.assets.list.Receive.find(
				coin => coin.Name === this.state.coinName
			);

			let chartData = props.chart.data.ThirtyDay.slice(-725);
			if (props.chart.intervalValue == "1D") {
				chartData = props.chart.data.OneDay.slice(-25)
			} else if (props.chart.intervalValue == "7D") {
				chartData = props.chart.data.SevenDay.slice(-169)
			}

			const timestamps = chartData.map(data => data && data.Timestamp);
			const rates = chartData.map(data => data && data.Rate.toFixed(3));
			const tooltip = chartData.map(data => {
				const date = String(new Date(data.Timestamp * 1000));
				return `${date.slice(8, 10)} ${date.slice(4, 7)} ${date.slice(16, 21)}`;
			});
			const { Rate, Timestamp } = chartData[chartData.length - 1];
			if (props.chart.intervalValue == "1D") {
				this.setState({
					options: {
						scaleBegingAtZero: false,
						tooltips: {
							shadowOffsetX: 0,
							shadowOffsetY: 4,
							shadowBlur: 20,
							shadowColor: "rgba(0, 0, 0, 0.04)",
							mode: "index",
							intersect: false,
							backgroundColor: "white",
							borderColor: "#E8EAEB",
							borderWidth: 1,
							cornerRadius: 3,
							bodyFontColor: "#667075", //coin.Primary, 
							bodyFontSize: 14,
							bodyFontStyle: "bold",
							titleFontColor: "#1A1D1F",
							titleFontSize: 14,
							footerFontColor: "red",
							displayColors: false,
							xPadding: 12,
							yPadding: 12,
							callbacks: {
								title: ([tooltipItem], data) => tooltip[tooltipItem.index],
								label: function (tooltipItem, data) {
									let val = parseFloat(rates[tooltipItem.index])
									if (val > 0.1) {
										return val.toFixed(2) + ` GBP/${coin.Name}`
									} else {
										return val + ` GBP/${coin.Name}`
									}
								}
							}
						},
						hover: {
							mode: "index",
							intersect: false
						},
						layout: {
							padding: {
								top: 0
							}
						},
						scales: {
							yAxes: [
								{
									gridLines: {
										drawBorder: false,
										borderDash: [1, 8],
										color: "#B0B9BD"
									},
									ticks: {
										userCallback: function (label, index, labels) {
											if (label < 0.1) {
												return parseFloat(label.toFixed(3));
											} else {
												return parseFloat(label.toFixed(2));
											}
										},
										maxTicksLimit: 5
									}
								}
							],
							xAxes: [
								{
									gridLines: {
										display: false
									},
									ticks: {
										maxRotation: 0,
										fontColor: "#A8ADB2",
										maxTicksLimit: 4,
										padding: 15,
										callback: value => String(new Date(value * 1000)).slice(16, 21)
									},
									offset: true
								}
							]
						},
						legend: {
							display: false
						},
						responsive: true,
						maintainAspectRatio: false
					},
					data: canvas => {
						return {
							labels: timestamps,
							datasets: [
								{
									label: "",
									borderColor: coin.Primary,
									borderWidth: 2,
									data: rates,
									lineTension: 0.1,
									pointRadius: 0,
									cubicInterpolationMode: "default",
									backgroundColor: "transparent"
								}
							]
						};
					},
					latestRate: Rate,
					latestTimestamp: Timestamp * 1000
				});
			} else {
				this.setState({
					options: {
						scaleBegingAtZero: false,
						tooltips: {
							shadowOffsetX: 0,
							shadowOffsetY: 4,
							shadowBlur: 20,
							shadowColor: "rgba(0, 0, 0, 0.04)",
							mode: "index",
							intersect: false,
							backgroundColor: "white",
							borderColor: "#E8EAEB",
							borderWidth: 1,
							cornerRadius: 3,
							bodyFontColor: "#667075", //coin.Primary
							bodyFontSize: 14,
							bodyFontStyle: "bold",
							titleFontColor: "#1A1D1F",
							titleFontSize: 14,
							titleFontStyle: "bold",
							footerFontColor: "red",
							displayColors: false,
							xPadding: 12,
							yPadding: 12,
							callbacks: {
								title: ([tooltipItem], data) => tooltip[tooltipItem.index],
								label: function (tooltipItem, data) {
									let val = parseFloat(rates[tooltipItem.index])
									if (val > 0.1) {
										return val.toFixed(2) + ` GBP/${coin.Name}`
									} else {
										return val + ` GBP/${coin.Name}`
									}
								}
							}
						},
						hover: {
							mode: "index",
							intersect: false
						},
						layout: {
							padding: {
								top: 0
							}
						},
						scales: {
							yAxes: [
								{
									gridLines: {
										drawBorder: false,
										borderDash: [1, 8],
										color: "#B0B9BD"
									},
									ticks: {
										maxTicksLimit: 5
									}
								}
							],
							xAxes: [
								{
									gridLines: {
										display: false
									},
									ticks: {
										maxRotation: 0,
										fontColor: "#A8ADB2",
										maxTicksLimit: 4,
										padding: 15,
										callback: value => String(new Date(value * 1000)).slice(4, 10)
									},
									offset: true
								}
							]
						},
						legend: {
							display: false
						},
						responsive: true,
						maintainAspectRatio: false
					},
					data: canvas => {
						return {
							labels: timestamps,
							datasets: [
								{
									label: "",
									borderColor: coin.Primary,
									borderWidth: 2,
									data: rates,
									lineTension: 0.1,
									pointRadius: 0,
									cubicInterpolationMode: "default",
									backgroundColor: "transparent"
								}
							]
						};
					},
					latestRate: Rate,
					latestTimestamp: Timestamp * 1000
				});
			}
		}
	}
}

const mapStateToProps = ({ assets, chart }) => ({ assets, chart });
const mapDispatchToProps = { fetchRates, fetchAssetsList, changeTimeInterval };
const withRedux = connect(
	mapStateToProps,
	mapDispatchToProps
);

export default withRedux(withRouter(Chart));
