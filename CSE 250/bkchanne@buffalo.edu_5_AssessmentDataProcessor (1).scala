/**
 * cse250.pa0.objects.AssessmentDataProcessor.scala
 *
 * Copyright 2021 Andrew Hughes (ahughes6@buffalo.edu)
 *
 * This work is licensed under the Creative Commons
 * Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit
 * http://creativecommons.org/licenses/by-nc-sa/4.0/.
 *
 * Submission author
 * UBIT:bkchanne
 * Person#:50267161
 *
 * Collaborators (include UBIT name of each, comma separated):
 * UBIT:
 */
package cse250.pa0.objects

import cse250.objects.TaxParcel

import scala.+:

object AssessmentDataProcessor {

  def splitArrayToRowArray(splitHeaderRow: Array[String]): Array[String] =
  {
    val array: Array[String] = new Array[String](51)
    var index = 0
    var resultIndex = 0
    var str = ""

    while(index < splitHeaderRow.length)
      {
        if(splitHeaderRow.apply(index) != "")
          {
            if(splitHeaderRow.apply(index).contains("\"") )
              {
                println(str + " Has quotes in it")
                var quotes = splitHeaderRow.apply(index).count(_ == '\"')
                if(quotes%2 == 1)
                  {
                    var end = findTheEnd(splitHeaderRow, index)
                    str =  StringConcat(splitHeaderRow, index, end)
                    println("Should get here, we have a string of : " + str)
                    if(str.contains("\""))
                      {

                      }
                    array(resultIndex) = str
                    index = end + 1
                    resultIndex += 1
                  }
                else
                  {
                    println("IS THE STRING:" + str)
                    if(splitHeaderRow.apply(index).isEmpty != true) {
                      str = splitHeaderRow.apply(index)
                      println(str + "Is the string that contains a quote")
                      str = str.replaceAll("\"\"", "\"")
                      str = str.dropRight(1)
                      //str = str.dropRight(1)
                      str = str.substring(1)
                      array(resultIndex) = str
                      index += 1
                      resultIndex += 1
                    }
                    else {
                      array(resultIndex) = splitHeaderRow(index)
                      index += 1
                      resultIndex += 1
                    }
                  }
              }
            else
              {
                array(resultIndex) = splitHeaderRow.apply(index)
                resultIndex += 1
                index += 1
              }
          }
        else
          {
            array(resultIndex) = splitHeaderRow.apply(index)
            resultIndex += 1
            index += 1
        }
        //println(str +" has the resultindex: " + resultIndex.toString + " And Normal Index: " + index.toString)
        str = ""
      }
    if(splitHeaderRow.length < 51)
    {
      fillwithBlank(array, resultIndex,50)
    }

    for(x<-array)
      {
        //println(x)
      }
    array
  }

  def rowArrayToTaxParcel(rowData: Array[String]): TaxParcel = {
    //var cols = List(11,12,13,14,15,18,22,23,24,26,31,32,34,35,36,37,38,39,42,45,47)
    var acols = List(1,2,3,4,5,6,7,8,9,10,16,17,19,20,21,25,27,28,29,30,33,40,41,43,44,48,49,50,51)
    var parcel = new TaxParcel()
    var count = 0
    for(x<-TaxParcel.HEADERS) {
        parcel.parcelInfo+= (x -> rowData.apply(acols.apply(count)-1))
        count += 1
      }
    parcel
  }

  def computeUniqueDistrictsCount(dataset: Array[TaxParcel]): Int =
    {
      var str = ""
      //var uniques = List()
      var count = 0
      for(x<-dataset)
        {
          if(x.parcelInfo("COUNCIL DISTRICT") != null && !x.parcelInfo("COUNCIL DISTRICT").isEmpty && !str.contains(x.parcelInfo("COUNCIL DISTRICT")))
            {
              str += x.parcelInfo("COUNCIL DISTRICT") + "        "
              //List +: x.parcelInfo("COUNCIL DISTRICT")
              count += 1
            }
        }
        print(str)

      count
    }

  def computeSmallestLivingArea(dataset: Array[TaxParcel]): Int =
    {
      var smallest = -1
      var count = 1
      while(smallest <= 99 && count <= dataset.length-1)
        {
          if(dataset(count).parcelInfo("TOTAL LIVING AREA").toInt > 100)
            {
              smallest = dataset(count).parcelInfo("TOTAL LIVING AREA").toInt
            }
            count += 1
        }
      if(count == dataset.length-1 && smallest < 100)
      {
        return -1
      }
      else
        {
          for(x<-count to dataset.length-1)
            {
              if(dataset(x).parcelInfo("TOTAL LIVING AREA") != null && dataset(x).parcelInfo("TOTAL LIVING AREA").toInt >= 100 && dataset(x).parcelInfo("TOTAL LIVING AREA").toInt < smallest)
                {
                  smallest = dataset(x).parcelInfo("TOTAL LIVING AREA").toInt
                }
            }
        }
      smallest
    }

  def StringConcat(split: Array[String], startIdx: Int, endIdx: Int): String =
    {
      var str = ""
      for (i <- startIdx to endIdx) {
        str += split(i) + ","
      }
      str = str.dropRight(1)
      str = str.dropRight(1)
      str.substring(1)

      //str = str.dropRight(1)
      //str.substring(1)
    }
  def fillwithBlank(array: Array[String], start: Int, end: Int): Unit =
  {
    for(i <-start to end)
      {
        array(i) = ""
      }
  }
  def findEndQuote(array: Array[String], start: Int): Int =
    {
      var inQuotes = true
      var end = start + 1
      /*if(array.apply(start).count(_ == '\"') >= 2)
        {
          return start
        }*/

      while(inQuotes)
      {
        if(end == array.length)
        {
          inQuotes = false
          end = start
          return end
        }
          if (array(end).contains("\"") && inQuotes)
          {
            inQuotes = false
            return end
          }

        end += 1

      }
        end
    }
  def findTheEnd(array: Array[String], start: Int): Int =
    {
      var end = start + 1
      while(array(end).charAt(array(end).length-1) != '\"')
        {
          end += 1
        }
        //println(end)
      return end
    }
}
