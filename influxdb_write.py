from influxdb_client import InfluxDBClient, Point, WritePrecision
import datetime

# Podatki za povezavo
url = "http://localhost:8086"  # Naslov InfluxDB strežnika
token = "tvoj_token"           # API token za avtentikacijo
org = "tvoja_organizacija"     # Ime tvoje organizacije
bucket = "tvoj_bucket"         # Ime bucket-a, kamor želiš zapisati podatke

# Povezava z InfluxDB
client = InfluxDBClient(url=url, token=token, org=org)

# Funkcija za pošiljanje podatkov
def posiljanje_podatkov(measurement, polja):
    write_api = client.write_api(write_options="synchronous")

    # Ustvari točko z meritvijo in podatki
    point = Point(measurement).time(datetime.datetime.utcnow(), WritePrecision.NS)
    
    for kljuc, vrednost in polja.items():
        point.field(kljuc, vrednost)

    # Pošlji podatke v InfluxDB
    write_api.write(bucket=bucket, org=org, record=point)
    print(f"Podatki poslani: {polja}")

# Primer uporabe
if __name__ == "__main__":
    podatki = {
        "temperatura": 22.5,
        "vlažnost": 60
    }
    posiljanje_podatkov("okolje", podatki)

# Zapri povezavo
client.close()
