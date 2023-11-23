## --- Part Two ---

Packets sent to address `255` are handled by a device called a NAT (Not Always Transmitting). The NAT is responsible for managing power consumption of the network by blocking certain packets and watching for idle periods in the computers.

If a packet would be sent to address `255`, the NAT receives it instead. The NAT remembers only the **last** packet it receives; that is, the data in each packet it receives overwrites the NAT's packet memory with the new packet's `X` and `Y` values.

The NAT also monitors all computers on the network. If all computers have **empty incoming packet queues** and are **continuously trying to receive packets** without sending packets, the network is considered **idle**.

Once the network is idle, the NAT sends **only the last packet it received** to address `0`; this will cause the computers on the network to resume activity. In this way, the NAT can throttle power consumption of the network when the ship needs power in other areas.

Monitor packets released to the computer at address `0` by the NAT. **What is the first `Y` value delivered by the NAT to the computer at address `0` twice in a row?**

Although it hasn't changed, you can still [get your puzzle input](input.txt).

