---
layout: multipage-overview
title: 性能特点

discourse: false

partof: collections
overview-name: Collections

num: 12
language: zh-cn
---


前面的解释明确说明了不同的容器类型具有不同的性能特点。这通常是选择容器类型的首要依据。以下的两张表格，总结了一些关于容器类型常用操作的性能特点。

## 序列类型的性能特点

|      | head | tail | apply | update | prepend | append | insert |
|------|------|------|-------|--------|---------|--------|--------|
|**不可变序列**|  |       |        |         |        |        |
| List | C | C | L | L | C | L | - |
|Stream | C | C | L | L | C | L | - |
|Vector | eC | eC | eC | eC | eC | eC | - |
|Stack | C | C | L | L | C | L | L |
|Queue | aC | aC | L | L | C | C | - |
|Range | C | C | C | - | - | - | - |
|String | C | L | C | L | L | L | - |
|**可变序列**|  |       |        |         |        |        |  
|ArrayBuffer | C | L | C | C | L | aC | L |
|ListBuffer | C | L | L | L | C | C | L |
|StringBuilder | C | L | C | C | L | aC | L |
|MutableList | C | L | L | L | C | C | L |
|Queue | C | L | L | L | C | C | L |
|ArraySeq | C | L | C | C | - | - | - |
|Stack | C | L | L | L | C | L | L |
|ArrayStack | C | L | C | C | aC | L | L |
|Array | C | L | C | C | - | - | - |

## 集合和映射类型的性能特点

|lookup | add | remove | min |
|-------|-----|--------|-----|
|**不可变序列**|  |  |	 |  
|HashSet/HashMap | eC | eC | eC | L |  
|TreeSet/TreeMap | Log | Log | Log | Log |  
|BitSet | C | L | L | eC1 |  
|ListMap | L | L | L | L |  
|可变序列|  |  |	 |  
|HashSet/HashMap | eC | eC | eC | L |  
|WeakHashMap | eC | eC | eC | L |  
|BitSet | C | aC | C | eC1 |  
|TreeSet | Log | Log | Log | Log |  

标注：1 假设位是密集分布的

这两个表中的条目：

|解释如下|                 |  
|--------|-----------------|  
|C | 指操作的时间复杂度为常数 |  
|eC | 指操作的时间复杂度实际上为常数，但可能依赖于诸如一个向量最大长度或是哈希键的分布情况等一些假设。 |  
|aC | 该操作的均摊运行时间为常数。某些调用的可能耗时较长，但多次调用之下，每次调用的平均耗时是常数。 |  
|Log | 操作的耗时与容器大小的对数成正比。 |  
|L | 操作是线性的，耗时与容器的大小成正比。 |  
|- | 操作不被支持。 |  

第一张表处理序列类型——无论可变还是不可变——：

| 使用以下操作 |      |  
|--------|-----------------|   
|head | 选择序列的第一个元素。 |  
|tail | 生成一个包含除第一个元素以外所有其他元素的新的列表。 |  
|apply | 索引。 |  
|update | 功能性更新不可变序列，同步更新可变序列。 |  
|prepend | 添加一个元素到序列头。对于不可变序列，操作会生成个新的序列。对于可变序列，操作会修改原有的序列。 |  
|append | 在序列尾部插入一个元素。对于不可变序列，这将产生一个新的序列。对于可变序列，这将修改原有的序列。 |  
|insert | 在序列的任意位置上插入一个元素。只有可变序列支持该操作。 |  

第二个表处理可变和不可变集与映射  

| 使用以下操作：|       |  
|--------|-----------------|  
|lookup | 测试一个元素是否被包含在集合中，或者找出一个键对应的值 |  
|add | 添加一个新的元素到一个集合中或者添加一个键值对到一个映射中。 |  
|remove | 移除一个集合中的一个元素或者移除一个映射中一个键。 |  
|min | 集合中的最小元素，或者映射中的最小键。 |  
