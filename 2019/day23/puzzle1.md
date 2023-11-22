## --- Day 23: Category Six ---

The droids have finished repairing as much of the ship as they can. Their report indicates that this was a **Category 6** disaster - not because it was that bad, but because it destroyed the stockpile of [Category 6](https://en.wikipedia.org/wiki/Category_6_cable) network cables as well as most of the ship's network infrastructure.

You'll need to **rebuild the network from scratch**.

The computers on the network are standard [Intcode](9) computers that communicate by sending **packets** to each other. There are `50` of them in total, each running a copy of the same **Network Interface Controller** (NIC) software (your puzzle input). The computers have **network addresses** `0` through `49`; when each computer boots up, it will request its network address via a single input instruction. Be sure to give each computer a unique network address.

Once a computer has received its network address, it will begin doing work and communicating over the network by sending and receiving **packets**. All packets contain **two values** named `X` and `Y`. Packets sent to a computer are queued by the recipient and read in the order they are received.

To **send** a packet to another computer, the NIC will use **three output instructions** that provide the **destination address** of the packet followed by its `X` and `Y` values. For example, three output instructions that provide the values `10`, `20`, `30` would send a packet with `X=20` and `Y=30` to the computer with address `10`.

To **receive** a packet from another computer, the NIC will use an **input instruction**. If the incoming packet queue is **empty**, provide `-1`. Otherwise, provide the `X` value of the next packet; the computer will then use a second input instruction to receive the `Y` value for the same packet. Once both values of the packet are read in this way, the packet is removed from the queue.

Note that these input and output instructions never [block](https://en.wikipedia.org/wiki/Blocking_(computing)). Specifically, output instructions do not wait for the sent packet to be received - the computer might send multiple packets before receiving any. Similarly, input instructions do not wait for a packet to arrive - if no packet is waiting, input instructions should receive `-1`.

Boot up all `50` computers and attach them to your network. **What is the `Y` value of the first packet sent to address `255`?**

To begin, [get your puzzle input](23/input).

To begin, [get your puzzle input](input.txt).

